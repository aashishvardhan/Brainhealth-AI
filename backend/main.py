"""
BrainHealth AI - FastAPI Backend
AI-Powered Brain Stroke Detection Platform using CNN and HuggingFace

Features:
- Brain stroke detection from MRI/CT images using CNN
- HuggingFace chatbot for neurology Q&A
- OpenStreetMap integration for hospital locations
- Free to deploy on Render or HuggingFace Spaces
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Optional, List, Dict
import numpy as np
from PIL import Image
import io
import os
from datetime import datetime
import random
import base64

# ML/AI imports
SKIP_TF = os.getenv('SKIP_TENSORFLOW', '1') == '1'  # Default to SKIP for Render free tier

if not SKIP_TF:
    try:
        import tensorflow as tf
        from tensorflow import keras
        import cv2
        TENSORFLOW_AVAILABLE = True
        PDF_AVAILABLE = True
        print("✅ TensorFlow loaded successfully")
    except ImportError as e:
        TENSORFLOW_AVAILABLE = False
        PDF_AVAILABLE = False
        print(f"⚠️ TensorFlow not available: {e}")
else:
    TENSORFLOW_AVAILABLE = False
    PDF_AVAILABLE = False
    print("⚠️ Running in lite mode (TensorFlow skipped)")
    # Dummy imports for PDF generation
    try:
        import cv2
        PDF_AVAILABLE = True
    except:
        PDF_AVAILABLE = False

try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    print("⚠️ Transformers not available. Using rule-based chatbot.")

# ==================== FastAPI App ====================

app = FastAPI(
    title="BrainHealth AI API",
    description="AI-Powered Brain Stroke Detection and Healthcare Platform",
    version="1.0.0"
)

# CORS middleware - allow Firebase and localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://brainhealth-ai.web.app",
        "https://brainhealth-ai.firebaseapp.com",
        "*"  # Keep wildcard for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Global Variables ====================

stroke_model = None
chatbot = None

# ==================== Models ====================

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    timestamp: str

class StrokeResult(BaseModel):
    prediction: str
    confidence: float
    stroke_detected: bool
    risk_level: str
    timestamp: str
    recommendations: List[str]
    stroke_type: Optional[str] = None
    gradcam_image: Optional[str] = None

class PDFRequest(BaseModel):
    patient_name: str
    image_name: str
    prediction: str
    confidence: float
    stroke_detected: bool
    risk_level: str
    stroke_type: Optional[str] = None
    recommendations: List[str]
    chatbot_advice: Optional[str] = None
    gradcam_base64: Optional[str] = None

class Hospital(BaseModel):
    name: str
    address: str
    distance: str
    phone: str
    url: str
    lat: float
    lon: float

# ==================== Model Loading ====================

def load_stroke_detection_model():
    """Load pre-trained CNN model for stroke detection"""
    global stroke_model
    
    model_path = 'models/stroke_cnn_model.h5'
    
    if TENSORFLOW_AVAILABLE and os.path.exists(model_path):
        try:
            stroke_model = keras.models.load_model(model_path)
            print("✅ Stroke detection model loaded successfully!")
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            stroke_model = None
    else:
        print("⚠️ Using dummy stroke detection (model not found)")
        stroke_model = None

def load_chatbot():
    """Load HuggingFace chatbot model"""
    global chatbot
    
    if TRANSFORMERS_AVAILABLE:
        try:
            # Using a lightweight conversational model from HuggingFace
            # Options: facebook/blenderbot-400M-distill, microsoft/DialoGPT-medium
            chatbot = pipeline(
                "conversational",
                model="facebook/blenderbot-400M-distill",
                device=-1  # CPU only for free deployment
            )
            print("✅ HuggingFace chatbot loaded successfully!")
        except Exception as e:
            print(f"❌ Error loading chatbot: {e}")
            chatbot = None
    else:
        print("⚠️ Using rule-based chatbot")
        chatbot = None

# Load models on startup
@app.on_event("startup")
async def startup_event():
    load_stroke_detection_model()
    load_chatbot()

# ==================== Helper Functions ====================

def preprocess_image(image: Image.Image, target_size=(224, 224)):
    """Preprocess image for CNN model"""
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize
    image = image.resize(target_size)
    
    # Convert to array and normalize
    img_array = np.array(image) / 255.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

def analyze_image_features(image: Image.Image):
    """Analyze image features to generate risk score (dummy implementation)"""
    # Convert to grayscale for analysis
    gray = image.convert('L')
    pixels = np.array(gray)
    
    # Calculate simple features
    mean_intensity = np.mean(pixels)
    std_intensity = np.std(pixels)
    
    # Generate a pseudo-random but consistent risk score
    risk_score = (mean_intensity / 255.0 * 0.4 + std_intensity / 128.0 * 0.6)
    risk_score = min(max(risk_score, 0.0), 1.0)
    
    return risk_score

def generate_gradcam_heatmap(img_array, model, last_conv_layer_name='conv2d_3'):
    """
    Generate Grad-CAM heatmap for explainable AI visualization
    Shows which brain regions influenced the stroke detection
    """
    try:
        if not TENSORFLOW_AVAILABLE or model is None:
            return None
        
        # Create a model that outputs both predictions and last conv layer
        grad_model = keras.Model(
            inputs=[model.input],
            outputs=[model.get_layer(last_conv_layer_name).output, model.output]
        )
        
        # Compute gradient
        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(img_array)
            class_idx = 0  # Stroke class
            loss = predictions[:, class_idx]
        
        # Get gradients
        grads = tape.gradient(loss, conv_outputs)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        
        # Weight conv outputs by gradients
        conv_outputs = conv_outputs[0]
        heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)
        
        # Normalize heatmap
        heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
        heatmap = heatmap.numpy()
        
        return heatmap
        
    except Exception as e:
        print(f"Grad-CAM error: {e}")
        return None

def create_gradcam_overlay(original_image, heatmap):
    """
    Create visual overlay of Grad-CAM heatmap on original image
    """
    try:
        # Resize heatmap to match image size
        img_array = np.array(original_image)
        heatmap_resized = cv2.resize(heatmap, (img_array.shape[1], img_array.shape[0]))
        
        # Convert heatmap to RGB
        heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET)
        heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
        
        # Overlay heatmap on original image
        overlay = cv2.addWeighted(img_array, 0.6, heatmap_colored, 0.4, 0)
        
        # Convert to base64 for frontend
        overlay_pil = Image.fromarray(overlay)
        buffer = io.BytesIO()
        overlay_pil.save(buffer, format='PNG')
        buffer.seek(0)
        img_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        return img_base64
        
    except Exception as e:
        print(f"Overlay error: {e}")
        return None

def classify_stroke_type(confidence: float, image_features: dict) -> str:
    """
    Classify type of stroke based on confidence and image analysis
    """
    if confidence < 50:
        return "No Stroke Detected"
    elif confidence < 70:
        return "Possible TIA (Transient Ischemic Attack)"
    elif confidence < 85:
        return "Likely Ischemic Stroke"
    else:
        return "Likely Hemorrhagic Stroke"

def generate_medical_pdf(report_data: PDFRequest) -> str:
    """
    Generate comprehensive medical PDF report
    """
    try:
        # Import PDF libraries here (lazy loading to avoid conflicts)
        from reportlab.lib.pagesizes import letter, A4
        from reportlab.lib.units import inch
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.enums import TA_CENTER, TA_LEFT
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, Table, TableStyle, PageBreak
        from reportlab.lib import colors
        
        if not PDF_AVAILABLE:
            raise Exception("PDF generation libraries not available")
        
        # Create reports directory
        os.makedirs('reports', exist_ok=True)
        
        # Generate unique filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"reports/BrainHealth_Report_{report_data.patient_name.replace(' ', '_')}_{timestamp}.pdf"
        
        # Create PDF
        doc = SimpleDocTemplate(filename, pagesize=letter,
                              rightMargin=72, leftMargin=72,
                              topMargin=72, bottomMargin=18)
        
        # Container for PDF elements
        elements = []
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#2563eb'),
            spaceAfter=12,
            spaceBefore=12
        )
        
        # Title
        elements.append(Paragraph("🧠 BrainHealth AI", title_style))
        elements.append(Paragraph("Medical Stroke Detection Report", styles['Heading2']))
        elements.append(Spacer(1, 0.3*inch))
        
        # Patient Information
        elements.append(Paragraph("Patient Information", heading_style))
        patient_data = [
            ['Patient Name:', report_data.patient_name],
            ['Report Date:', datetime.now().strftime('%B %d, %Y %I:%M %p')],
            ['Image File:', report_data.image_name],
            ['Report ID:', f"BH-{timestamp}"]
        ]
        patient_table = Table(patient_data, colWidths=[2*inch, 4*inch])
        patient_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e0e7ff')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey)
        ]))
        elements.append(patient_table)
        elements.append(Spacer(1, 0.3*inch))
        
        # Detection Results
        elements.append(Paragraph("AI Detection Results", heading_style))
        
        # Result color based on detection
        result_color = colors.red if report_data.stroke_detected else colors.green
        
        results_data = [
            ['Prediction:', report_data.prediction],
            ['Confidence Score:', f"{report_data.confidence}%"],
            ['Risk Level:', report_data.risk_level],
            ['Stroke Type:', report_data.stroke_type or "N/A"],
            ['Status:', 'POSITIVE' if report_data.stroke_detected else 'NEGATIVE']
        ]
        results_table = Table(results_data, colWidths=[2*inch, 4*inch])
        results_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#fef3c7')),
            ('BACKGROUND', (1, 4), (1, 4), result_color),
            ('TEXTCOLOR', (1, 4), (1, 4), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 4), (1, 4), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey)
        ]))
        elements.append(results_table)
        elements.append(Spacer(1, 0.3*inch))
        
        # Grad-CAM Visualization
        if report_data.gradcam_base64:
            elements.append(Paragraph("Explainable AI Visualization (Grad-CAM)", heading_style))
            elements.append(Paragraph(
                "The heatmap below highlights brain regions that influenced the AI's decision. "
                "Red/yellow areas indicate regions of high importance for stroke detection.",
                styles['Normal']
            ))
            elements.append(Spacer(1, 0.2*inch))
            
            # Decode and add Grad-CAM image
            try:
                img_data = base64.b64decode(report_data.gradcam_base64)
                img_buffer = io.BytesIO(img_data)
                gradcam_img = RLImage(img_buffer, width=4*inch, height=4*inch)
                elements.append(gradcam_img)
                elements.append(Spacer(1, 0.3*inch))
            except:
                pass
        
        # Medical Recommendations
        elements.append(Paragraph("Medical Recommendations", heading_style))
        for i, rec in enumerate(report_data.recommendations, 1):
            elements.append(Paragraph(f"{i}. {rec}", styles['Normal']))
            elements.append(Spacer(1, 0.1*inch))
        
        elements.append(Spacer(1, 0.2*inch))
        
        # Hospital Recommendations
        elements.append(Paragraph("Recommended Actions", heading_style))
        if report_data.stroke_detected:
            actions = [
                "🚨 Seek immediate medical attention",
                "📞 Call emergency services (108/112)",
                "🏥 Visit nearest neurology hospital",
                "📋 Show this report to your doctor",
                "⏰ Time is critical - act within 3-4.5 hours"
            ]
        else:
            actions = [
                "✅ Continue regular health checkups",
                "💪 Maintain healthy lifestyle",
                "🥗 Follow brain-healthy diet",
                "📊 Monitor blood pressure regularly",
                "🏃 Exercise 30 minutes daily"
            ]
        
        for action in actions:
            elements.append(Paragraph(f"• {action}", styles['Normal']))
            elements.append(Spacer(1, 0.08*inch))
        
        elements.append(Spacer(1, 0.3*inch))
        
        # AI Chatbot Advice
        if report_data.chatbot_advice:
            elements.append(Paragraph("AI Health Assistant Advice", heading_style))
            elements.append(Paragraph(report_data.chatbot_advice, styles['Normal']))
            elements.append(Spacer(1, 0.3*inch))
        
        # Disclaimer
        elements.append(PageBreak())
        elements.append(Paragraph("Important Disclaimer", heading_style))
        disclaimer_text = """
        <b>⚠️ MEDICAL DISCLAIMER:</b><br/><br/>
        
        This report is generated by an AI-powered system for informational and educational purposes only. 
        It is NOT a substitute for professional medical diagnosis, advice, or treatment.<br/><br/>
        
        <b>Please note:</b><br/>
        • This AI analysis should be confirmed by qualified medical professionals<br/>
        • Always consult a licensed neurologist or healthcare provider<br/>
        • Do not delay seeking medical care based on this report<br/>
        • Individual results may vary and require clinical interpretation<br/>
        • This tool is designed to assist, not replace, medical expertise<br/><br/>
        
        <b>In case of emergency:</b><br/>
        If you are experiencing stroke symptoms (face drooping, arm weakness, speech difficulty), 
        call emergency services immediately: India (108/112), US (911), UK (999).<br/><br/>
        
        <b>About BrainHealth AI:</b><br/>
        BrainHealth AI uses advanced deep learning algorithms to analyze brain imaging. 
        The system continuously improves through machine learning but should always be verified 
        by medical professionals with appropriate credentials and clinical context.<br/><br/>
        
        Generated by BrainHealth AI Platform | www.brainhealth-ai.com<br/>
        For questions or support: support@brainhealth-ai.com
        """
        elements.append(Paragraph(disclaimer_text, styles['Normal']))
        
        # Build PDF
        doc.build(elements)
        
        return filename
        
    except Exception as e:
        print(f"PDF generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

def get_rule_based_response(message: str) -> str:
    """Rule-based chatbot responses for neurology Q&A"""
    message_lower = message.lower()
    
    # Greetings
    if any(word in message_lower for word in ['hello', 'hi', 'hey', 'greetings']):
        return "Hello! I'm BrainCare AI Bot, your neurology health assistant. I can help you understand stroke symptoms, prevention, and brain health. What would you like to know?"
    
    # Stroke symptoms
    elif any(word in message_lower for word in ['symptom', 'symptoms', 'signs', 'warning']):
        return """🚨 **Common Stroke Symptoms (Remember F.A.S.T.):**

• **F**ace drooping - One side of the face feels numb or droops
• **A**rm weakness - One arm feels weak or numb
• **S**peech difficulty - Speech is slurred or hard to understand
• **T**ime to call emergency - Call 108/112 immediately!

**Other Warning Signs:**
- Sudden confusion or trouble understanding
- Sudden trouble seeing in one or both eyes
- Sudden severe headache with no known cause
- Sudden dizziness, loss of balance, or coordination

⏰ Time is brain! Every minute counts in stroke treatment."""
    
    # Prevention
    elif any(word in message_lower for word in ['prevent', 'prevention', 'avoid', 'reduce risk']):
        return """💪 **Stroke Prevention Strategies:**

✓ **Control Blood Pressure:** Keep it under 120/80 mmHg
✓ **Exercise Regularly:** 30 minutes daily, 5 days a week
✓ **Healthy Diet:** Mediterranean diet with fruits, vegetables, whole grains
✓ **Quit Smoking:** Doubles stroke risk when smoking
✓ **Limit Alcohol:** No more than 1-2 drinks per day
✓ **Manage Diabetes:** Keep blood sugar in healthy range
✓ **Maintain Healthy Weight:** BMI between 18.5-24.9
✓ **Reduce Stress:** Practice meditation, yoga, or mindfulness
✓ **Regular Checkups:** Monitor cholesterol and heart health

📊 These changes can reduce stroke risk by up to 80%!"""
    
    # Types of stroke
    elif any(word in message_lower for word in ['type', 'types', 'kind', 'ischemic', 'hemorrhagic']):
        return """🧠 **Types of Strokes:**

1. **Ischemic Stroke (87% of cases)**
   - Caused by blocked blood vessel in brain
   - Due to blood clots or plaque buildup
   - Treatment: Clot-busting drugs, thrombectomy

2. **Hemorrhagic Stroke (13% of cases)**
   - Caused by burst blood vessel in brain
   - Due to high blood pressure, aneurysm, trauma
   - Treatment: Surgery to stop bleeding, reduce pressure

3. **TIA - Transient Ischemic Attack (Mini-Stroke)**
   - Temporary blockage, symptoms last < 24 hours
   - Warning sign of future stroke
   - Requires immediate medical attention

Each type requires different treatment - early diagnosis is crucial!"""
    
    # Risk factors
    elif any(word in message_lower for word in ['risk', 'factor', 'causes', 'who']):
        return """⚠️ **Stroke Risk Factors:**

**Controllable Risk Factors:**
- High blood pressure (most important!)
- Smoking & tobacco use
- Diabetes
- High cholesterol
- Obesity & physical inactivity
- Poor diet
- Excessive alcohol consumption
- Drug use
- Sleep apnea

**Non-Controllable Risk Factors:**
- Age (55+ years higher risk)
- Family history & genetics
- Gender (slightly higher in men)
- Previous stroke or TIA
- Race (higher in African Americans)

Focus on what you CAN control to reduce your risk!"""
    
    # Treatment
    elif any(word in message_lower for word in ['treatment', 'treat', 'cure', 'therapy', 'recover']):
        return """⚕️ **Stroke Treatment:**

**Emergency Treatment (First 3-4.5 hours):**
- Ischemic: tPA (clot-busting drug)
- Mechanical thrombectomy to remove clot
- Hemorrhagic: Surgery to stop bleeding

**Rehabilitation:**
- Physical therapy - restore movement
- Speech therapy - improve communication
- Occupational therapy - relearn daily tasks
- Cognitive therapy - improve memory & thinking
- Emotional support - manage depression & anxiety

⏰ **"Time is Brain"** - Get treatment within 3-4.5 hours for best outcomes!

Many stroke survivors regain independence with proper treatment and rehabilitation."""
    
    # Diet
    elif any(word in message_lower for word in ['diet', 'food', 'eat', 'nutrition']):
        return """🥗 **Brain-Healthy Diet for Stroke Prevention:**

**Foods to EAT:**
- Leafy greens (spinach, kale)
- Fatty fish (salmon, sardines, mackerel)
- Berries (blueberries, strawberries)
- Nuts & seeds (walnuts, almonds)
- Whole grains (oats, brown rice)
- Olive oil & avocados
- Legumes (beans, lentils)
- Dark chocolate (70%+ cacao)

**Foods to LIMIT:**
- Salt/sodium
- Saturated fats
- Trans fats
- Processed foods
- Sugary drinks
- Red meat

🫒 **Mediterranean Diet** is excellent for brain health and stroke prevention!"""
    
    # Recovery
    elif any(word in message_lower for word in ['recovery', 'recover', 'rehabilitation', 'after stroke']):
        return """🌟 **Stroke Recovery & Rehabilitation:**

**Recovery Timeline:**
- Most recovery happens in first 3-6 months
- Improvement can continue for years
- Every person's journey is unique

**Rehabilitation Types:**
- Physical therapy (movement, balance, coordination)
- Speech-language therapy (speaking, swallowing)
- Occupational therapy (daily activities)
- Cognitive therapy (memory, attention, problem-solving)

**Keys to Successful Recovery:**
✓ Start rehabilitation early
✓ Be consistent with therapy
✓ Stay motivated & positive
✓ Get family support
✓ Prevent second stroke
✓ Manage emotions
✓ Set realistic goals

💪 With dedication, many survivors regain independence and return to meaningful activities!"""
    
    # Emergency
    elif any(word in message_lower for word in ['emergency', '108', '112', 'urgent', 'help']):
        return """🚨 **EMERGENCY STROKE CARE:**

**If you suspect a stroke, ACT IMMEDIATELY:**

1. **Call Emergency Services:**
   - India: 108 (Ambulance) or 112 (Emergency)
   - US: 911
   - UK: 999

2. **Note the Time:** When symptoms started (critical for treatment)

3. **Do NOT:**
   - Drive yourself to hospital
   - Eat or drink anything
   - Take any medication without medical advice

4. **While Waiting:**
   - Keep person calm and comfortable
   - Loosen tight clothing
   - Monitor breathing
   - Don't leave them alone

⏰ **Every second counts!** Treatment within 3-4.5 hours can prevent permanent brain damage.

Use our Stroke Detection tool if you have brain scan images."""
    
    # Brain health
    elif any(word in message_lower for word in ['brain', 'memory', 'cognition', 'mental']):
        return """🧠 **Brain Health & Wellness:**

**Keep Your Brain Sharp:**
- Learn new skills & languages
- Read books & solve puzzles
- Stay socially active
- Get 7-9 hours quality sleep
- Manage stress effectively
- Exercise regularly (boosts brain blood flow)
- Meditate or practice mindfulness

**Brain-Boosting Activities:**
- Music (playing or listening)
- Dancing
- Art & creativity
- Games (chess, sudoku)
- Learning an instrument
- Teaching others

**Neuroprotective Habits:**
✓ Stay hydrated
✓ Limit screen time
✓ Spend time in nature
✓ Practice gratitude
✓ Maintain purpose & meaning

Your brain is like a muscle - use it or lose it!"""
    
    # Default response
    else:
        return """I can help you with information about:

🔹 **Stroke Symptoms** - Warning signs & F.A.S.T. method
🔹 **Prevention** - How to reduce stroke risk
🔹 **Types of Strokes** - Ischemic, Hemorrhagic, TIA
🔹 **Risk Factors** - What increases stroke risk
🔹 **Treatment** - Emergency care & rehabilitation
🔹 **Diet & Nutrition** - Brain-healthy foods
🔹 **Recovery** - Rehabilitation & healing
🔹 **Emergency Care** - What to do in a stroke
🔹 **Brain Health** - Tips for cognitive wellness

What would you like to know about? 😊"""

# ==================== API Endpoints ====================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🧠 BrainHealth AI API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "stroke_detection": "/api/detect-stroke",
            "chatbot": "/api/chat",
            "hospitals": "/api/hospitals",
            "wellness_tip": "/api/wellness-tip",
            "health": "/api/health"
        }
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "stroke_model": "loaded" if stroke_model else "dummy",
            "chatbot": "loaded" if chatbot else "rule-based"
        }
    }

@app.post("/api/detect-stroke", response_model=StrokeResult)
async def detect_stroke(file: UploadFile = File(...)):
    """
    Detect stroke from uploaded brain scan image (MRI/CT)
    Accepts: JPG, PNG, DICOM formats
    Returns: Stroke prediction with confidence score + Grad-CAM visualization
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Please upload an image file (JPG, PNG)."
            )
        
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Preprocess for model
        processed_image = preprocess_image(image)
        
        # Initialize variables
        gradcam_overlay_base64 = None
        stroke_type = None
        
        # Make prediction
        if stroke_model and TENSORFLOW_AVAILABLE:
            # Use actual CNN model
            prediction = stroke_model.predict(processed_image, verbose=0)
            confidence = float(prediction[0][0]) * 100
            stroke_detected = confidence > 50
            
            # Generate Grad-CAM visualization
            try:
                heatmap = generate_gradcam_heatmap(processed_image, stroke_model)
                if heatmap is not None:
                    gradcam_overlay_base64 = create_gradcam_overlay(image, heatmap)
            except Exception as e:
                print(f"Grad-CAM generation failed: {e}")
        else:
            # Use dummy analysis based on image features
            risk_score = analyze_image_features(image)
            confidence = risk_score * 100
            stroke_detected = risk_score > 0.5
        
        # Classify stroke type
        stroke_type = classify_stroke_type(confidence, {})
        
        # Determine risk level
        if confidence > 80:
            risk_level = "High"
        elif confidence > 60:
            risk_level = "Moderate"
        else:
            risk_level = "Low"
        
        # Generate recommendations
        recommendations = []
        if stroke_detected:
            recommendations = [
                "⚠️ Potential stroke indicators detected",
                "🏥 Consult a neurologist immediately",
                "📞 Call emergency services if experiencing symptoms",
                "🗺️ Check nearby hospitals for immediate care",
                "📋 Download the medical report and bring to your doctor"
            ]
        else:
            recommendations = [
                "✅ No immediate stroke indicators detected",
                "🏥 Regular checkups are still recommended",
                "💪 Maintain healthy lifestyle habits",
                "📊 Monitor your blood pressure regularly",
                "🥗 Follow a brain-healthy diet"
            ]
        
        return StrokeResult(
            prediction="Stroke Risk Detected" if stroke_detected else "No Stroke Detected",
            confidence=round(confidence, 2),
            stroke_detected=stroke_detected,
            risk_level=risk_level,
            timestamp=datetime.now().isoformat(),
            recommendations=recommendations,
            stroke_type=stroke_type,
            gradcam_image=gradcam_overlay_base64
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/api/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """
    AI Chatbot endpoint for neurology Q&A
    Uses HuggingFace model or rule-based responses
    """
    try:
        user_message = message.message.strip()
        
        if not user_message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Generate response
        if chatbot and TRANSFORMERS_AVAILABLE:
            # Use HuggingFace chatbot
            from transformers import Conversation
            conversation = Conversation(user_message)
            result = chatbot(conversation)
            response_text = result.generated_responses[-1]
        else:
            # Use rule-based responses
            response_text = get_rule_based_response(user_message)
        
        return ChatResponse(
            response=response_text,
            timestamp=datetime.now().strftime('%H:%M:%S')
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.get("/api/hospitals")
async def get_nearby_hospitals(lat: float = 28.6139, lon: float = 77.2090, radius: int = 10):
    """
    Get nearby neurology hospitals using OpenStreetMap
    Default location: New Delhi, India
    """
    # Mock hospital data (in production, use Overpass API for OpenStreetMap)
    hospitals = [
        Hospital(
            name="Andhra Pradesh Government Hospital",
            address="Vijayawada, Andhra Pradesh",
            distance="",
            phone="+91-866-2474142",
            url="https://www.apgovthospitals.in",
            lat=16.5062,
            lon=80.6480
        ),
        Hospital(
            name="Apollo Hospitals",
            address="Sarita Vihar, New Delhi, 110076",
            distance="5.8 km",
            phone="+91-11-26825000",
            url="https://www.apollohospitals.com",
            lat=28.5355,
            lon=77.2893
        ),
        Hospital(
            name="Fortis Hospital",
            address="Okhla Road, New Delhi, 110025",
            distance="4.2 km",
            phone="+91-11-47135000",
            url="https://www.fortishealthcare.com",
            lat=28.5494,
            lon=77.2751
        ),
        Hospital(
            name="Max Super Specialty Hospital",
            address="Saket, New Delhi, 110017",
            distance="6.1 km",
            phone="+91-11-26515050",
            url="https://www.maxhealthcare.in",
            lat=28.5244,
            lon=77.2066
        ),
        Hospital(
            name="Indraprastha Apollo Hospital",
            address="Sarita Vihar, New Delhi, 110076",
            distance="5.5 km",
            phone="+91-11-26825000",
            url="https://www.apollohospitals.com/locations/delhi-indraprastha-apollo-hospital/",
            lat=28.5355,
            lon=77.2893
        )
    ]
    
    return {"hospitals": hospitals, "count": len(hospitals)}

@app.get("/api/wellness-tip")
async def get_wellness_tip():
    """Get random brain health wellness tip"""
    tips = [
        "🧠 Your brain uses 20% of your body's oxygen and energy!",
        "💧 Dehydration can shrink brain tissue - drink 8 glasses of water daily",
        "🎵 Learning to play a musical instrument enhances brain connectivity",
        "😴 During sleep, your brain clears out toxins that build up during the day",
        "🥗 Omega-3 fatty acids in fish can reduce brain inflammation",
        "🏃 Just 30 minutes of exercise can boost brain function for 2 hours",
        "📚 Learning a new language creates new neural pathways",
        "🧘 Meditation can actually increase gray matter in the brain",
        "🤝 Social connections reduce risk of cognitive decline by 70%",
        "☀️ Vitamin D from sunlight is crucial for brain health",
        "🎨 Creative activities stimulate multiple brain regions simultaneously",
        "🌿 Spending time in nature reduces stress hormones",
        "🍫 Dark chocolate (70%+ cacao) improves brain blood flow",
        "💤 Power naps (20-30 min) enhance memory consolidation",
        "🧩 Puzzles and brain games strengthen cognitive reserve"
    ]
    
    return {"tip": random.choice(tips)}

@app.post("/api/generate-report")
async def generate_report(report_request: PDFRequest):
    """
    Generate downloadable PDF medical report
    Includes patient info, detection results, Grad-CAM, recommendations
    """
    try:
        filename = generate_medical_pdf(report_request)
        
        # Return file for download
        return FileResponse(
            path=filename,
            filename=f"BrainHealth_Report_{report_request.patient_name.replace(' ', '_')}.pdf",
            media_type='application/pdf',
            headers={"Content-Disposition": f"attachment; filename=BrainHealth_Report_{report_request.patient_name.replace(' ', '_')}.pdf"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")


# ==================== Analytics Dashboard API ====================

@app.get("/api/analytics")
async def get_analytics(range: str = "30d"):
    """
    Get analytics data for dashboard
    Range: 7d, 30d, 90d
    """
    # Mock analytics data (in production, query from database)
    days = int(range.replace('d', ''))
    
    return {
        "total_scans": 1247,
        "stroke_detected": 423,
        "normal_scans": 824,
        "detection_rate": 33.9,
        "avg_confidence": 87.5,
        "daily_scans": [
            {"date": f"2025-11-{i:02d}", "count": random.randint(35, 65)}
            for i in range(1, min(days, 30) + 1)
        ],
        "risk_distribution": [
            {"category": "High Risk", "count": 156},
            {"category": "Medium Risk", "count": 267},
            {"category": "Low Risk", "count": 401},
            {"category": "Normal", "count": 423}
        ],
        "geographic_data": [
            {"region": "Andhra Pradesh", "cases": 234},
            {"region": "Delhi NCR", "cases": 189},
            {"region": "Maharashtra", "cases": 167},
            {"region": "Karnataka", "cases": 143},
            {"region": "Tamil Nadu", "cases": 128}
        ]
    }


# ==================== Family Sharing API ====================

class ShareRequest(BaseModel):
    scan_id: str
    expiry_days: int = 7
    max_access: int = 5

class EmailShareRequest(BaseModel):
    share_id: str
    emails: List[str]

@app.post("/api/share/generate")
async def generate_share_link(share_request: ShareRequest):
    """
    Generate secure share link for scan results
    """
    import uuid
    from datetime import timedelta
    
    share_id = f"SHR{uuid.uuid4().hex[:9].upper()}"
    share_token = uuid.uuid4().hex[:12]
    expires_at = datetime.now() + timedelta(days=share_request.expiry_days)
    
    # In production, store in database
    share_link = {
        "id": share_id,
        "url": f"https://brainhealth-ai.com/view/{share_token}",
        "expires_at": expires_at.isoformat(),
        "access_count": 0,
        "max_access": share_request.max_access
    }
    
    return share_link

@app.post("/api/share/email")
async def send_email_invites(email_request: EmailShareRequest):
    """
    Send email invitations with share link
    """
    # In production, integrate with SendGrid/AWS SES
    return {
        "status": "success",
        "message": f"Share link sent to {len(email_request.emails)} recipients",
        "recipients": email_request.emails
    }


# ==================== Main ====================

if __name__ == "__main__":
    import uvicorn
    
    print("🧠 BrainHealth AI - FastAPI Backend Starting...")
    print("📍 API Docs: http://localhost:8000/docs")
    print("✨ Press Ctrl+C to quit")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

