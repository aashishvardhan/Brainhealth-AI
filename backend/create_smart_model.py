"""
Create a smarter stroke detection model that analyzes actual image features
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import os

print("Creating intelligent stroke detection model...")
print(f"TensorFlow version: {tf.__version__}")

MODEL_DIR = 'models'
MODEL_PATH = os.path.join(MODEL_DIR, 'stroke_cnn_model.h5')

# Create models directory
os.makedirs(MODEL_DIR, exist_ok=True)

# Create a more sophisticated model using transfer learning
def create_model():
    """
    Create stroke detection model using MobileNetV2 with custom layers
    This model will analyze actual image features
    """
    
    # Use pre-trained MobileNetV2 as base (trained on ImageNet)
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'  # Download pre-trained weights
    )
    
    # Unfreeze last 20 layers for fine-tuning
    base_model.trainable = True
    for layer in base_model.layers[:-20]:
        layer.trainable = False
    
    # Build complete model
    model = keras.Sequential([
        layers.Input(shape=(224, 224, 3)),
        
        # Preprocessing
        layers.Rescaling(1./255),
        
        # Base model
        base_model,
        
        # Custom classification head
        layers.GlobalAveragePooling2D(),
        layers.Dense(512, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.4),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.3),
        
        # Output layer
        layers.Dense(1, activation='sigmoid')
    ])
    
    return model

# Create synthetic training data that mimics brain scan patterns
def create_training_data():
    """
    Create HIGHLY REALISTIC synthetic training data
    This creates distinct patterns that the model can ACTUALLY learn
    """
    print("\nGenerating REALISTIC training data...")
    
    n_samples = 1000  # More samples
    X_train = []
    y_train = []
    
    for i in range(n_samples):
        # Create base brain scan image (grayscale medical imaging style)
        img = np.ones((224, 224, 3), dtype=np.float32) * 30  # Dark background
        
        # Add realistic brain structure
        y_center, x_center = 112, 112
        
        # Create brain matter with varying intensities
        for y in range(224):
            for x in range(224):
                dist = np.sqrt((x - x_center)**2 + (y - y_center)**2)
                
                # Brain tissue (gray matter)
                if dist < 90:
                    base_intensity = 120 + np.random.randn() * 15
                    img[y, x] = [base_intensity, base_intensity, base_intensity]
                
                # White matter (brighter)
                if dist < 70:
                    base_intensity = 140 + np.random.randn() * 10
                    img[y, x] = [base_intensity, base_intensity, base_intensity]
        
        # Determine if stroke or normal
        has_stroke = i % 2 == 0
        
        if has_stroke:
            # STROKE PATTERNS - Very distinctive features
            stroke_type = np.random.choice(['ischemic', 'hemorrhagic'])
            
            if stroke_type == 'ischemic':
                # Dark region (lack of blood flow)
                num_lesions = np.random.randint(1, 3)
                for _ in range(num_lesions):
                    stroke_x = np.random.randint(70, 154)
                    stroke_y = np.random.randint(70, 154)
                    stroke_size = np.random.randint(15, 35)
                    
                    for y in range(max(0, stroke_y-stroke_size), min(224, stroke_y+stroke_size)):
                        for x in range(max(0, stroke_x-stroke_size), min(224, stroke_x+stroke_size)):
                            dist = np.sqrt((x - stroke_x)**2 + (y - stroke_y)**2)
                            if dist < stroke_size:
                                # Dark lesion with irregular edges
                                darkness = 40 + np.random.randn() * 10
                                edge_factor = 1 - (dist / stroke_size)
                                final_intensity = darkness * edge_factor + img[y, x, 0] * (1 - edge_factor)
                                img[y, x] = [final_intensity, final_intensity, final_intensity]
            
            else:  # hemorrhagic
                # Bright region (bleeding)
                stroke_x = np.random.randint(70, 154)
                stroke_y = np.random.randint(70, 154)
                stroke_size = np.random.randint(20, 40)
                
                for y in range(max(0, stroke_y-stroke_size), min(224, stroke_y+stroke_size)):
                    for x in range(max(0, stroke_x-stroke_size), min(224, stroke_x+stroke_size)):
                        dist = np.sqrt((x - stroke_x)**2 + (y - stroke_y)**2)
                        if dist < stroke_size:
                            # Bright hemorrhage
                            brightness = 200 + np.random.randn() * 20
                            edge_factor = 1 - (dist / stroke_size)
                            final_intensity = brightness * edge_factor + img[y, x, 0] * (1 - edge_factor)
                            img[y, x] = [final_intensity, final_intensity, final_intensity]
                
                # Add surrounding edema (swelling)
                edema_size = stroke_size + 15
                for y in range(max(0, stroke_y-edema_size), min(224, stroke_y+edema_size)):
                    for x in range(max(0, stroke_x-edema_size), min(224, stroke_x+edema_size)):
                        dist = np.sqrt((x - stroke_x)**2 + (y - stroke_y)**2)
                        if stroke_size < dist < edema_size:
                            img[y, x] = img[y, x] * 1.2
            
            y_train.append(1)  # STROKE
            
        else:
            # NORMAL BRAIN - smooth, uniform patterns
            # Add natural variations but NO abnormal lesions
            noise = np.random.randn(224, 224, 3) * 5
            img = img + noise
            
            # Add some natural asymmetry
            img[:, :112] = img[:, :112] * (0.95 + np.random.rand() * 0.1)
            
            y_train.append(0)  # NORMAL
        
        # Normalize to 0-255 range
        img = np.clip(img, 0, 255).astype('uint8')
        X_train.append(img)
    
    X_train = np.array(X_train).astype('float32')
    y_train = np.array(y_train).astype('float32')
    
    print(f"✅ Created {len(X_train)} REALISTIC training samples")
    print(f"   🔴 Stroke samples: {int(np.sum(y_train))}")
    print(f"   🟢 Normal samples: {int(len(y_train) - np.sum(y_train))}")
    
    return X_train, y_train

# Create and train the model
print("\n" + "="*50)
print("BUILDING MODEL")
print("="*50)

model = create_model()

# Compile model
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.0001),
    loss='binary_crossentropy',
    metrics=['accuracy', 
             keras.metrics.AUC(name='auc'),
             keras.metrics.Precision(name='precision'),
             keras.metrics.Recall(name='recall')]
)

print("\nModel Summary:")
model.summary()

# Create training data
X_train, y_train = create_training_data()

# Split into train/validation
split_idx = int(len(X_train) * 0.8)
X_val = X_train[split_idx:]
y_val = y_train[split_idx:]
X_train = X_train[:split_idx]
y_train = y_train[:split_idx]

print(f"\nTraining samples: {len(X_train)}")
print(f"Validation samples: {len(X_val)}")

# Train the model
print("\n" + "="*50)
print("TRAINING MODEL")
print("="*50)

history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=30,  # More epochs for better learning
    batch_size=8,  # Smaller batch for better gradients
    callbacks=[
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=8,
            restore_best_weights=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=4,
            min_lr=1e-7
        )
    ],
    verbose=1
)

# Evaluate
print("\n" + "="*50)
print("EVALUATION")
print("="*50)

results = model.evaluate(X_val, y_val, verbose=0)
print(f"\nValidation Loss: {results[0]:.4f}")
print(f"Validation Accuracy: {results[1]:.4f}")
print(f"Validation AUC: {results[2]:.4f}")
print(f"Validation Precision: {results[3]:.4f}")
print(f"Validation Recall: {results[4]:.4f}")

# Save the model
model.save(MODEL_PATH)
print(f"\n✅ Model saved successfully to: {MODEL_PATH}")
print(f"✅ Model size: {os.path.getsize(MODEL_PATH) / (1024*1024):.2f} MB")

print("\n" + "="*50)
print("MODEL READY FOR DEPLOYMENT")
print("="*50)
print("\n⚠️ Note: This model is trained on synthetic data.")
print("For production use, train on real medical imaging datasets.")
print("\nNow restart the backend server to use this model!")
