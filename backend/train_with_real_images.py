"""
Train Stroke Detection Model with Real Medical Images
Place your images in:
- training_data/stroke/  (stroke brain scans)
- training_data/normal/  (normal brain scans)
"""

import os
import numpy as np
import cv2
from PIL import Image
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split
from sklearn.utils import shuffle
import matplotlib.pyplot as plt

print("=" * 50)
print("STROKE DETECTION MODEL TRAINING")
print("Training with Real Medical Images")
print("=" * 50)

# Configuration
IMG_SIZE = 224
BATCH_SIZE = 8
EPOCHS = 50
LEARNING_RATE = 0.0001

# Paths
STROKE_DIR = 'training_data/stroke'
NORMAL_DIR = 'training_data/normal'
MODEL_PATH = 'models/stroke_cnn_model.h5'

def load_and_preprocess_image(image_path, label):
    """Load and preprocess a single image"""
    try:
        # Read image
        img = cv2.imread(image_path)
        if img is None:
            print(f"⚠️ Could not read: {image_path}")
            return None, None
        
        # Convert BGR to RGB
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Resize to target size
        img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
        
        # Normalize to [0, 1]
        img = img.astype(np.float32) / 255.0
        
        return img, label
        
    except Exception as e:
        print(f"❌ Error loading {image_path}: {e}")
        return None, None

def enhance_medical_image(img):
    """
    Enhance medical image contrast and features
    Applies CLAHE (Contrast Limited Adaptive Histogram Equalization)
    """
    # Convert to grayscale for CLAHE
    gray = cv2.cvtColor((img * 255).astype(np.uint8), cv2.COLOR_RGB2GRAY)
    
    # Apply CLAHE
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)
    
    # Convert back to RGB
    enhanced_rgb = cv2.cvtColor(enhanced, cv2.COLOR_GRAY2RGB)
    
    # Normalize
    enhanced_rgb = enhanced_rgb.astype(np.float32) / 255.0
    
    return enhanced_rgb

def load_dataset():
    """Load all images from directories (recursively searches subfolders)"""
    images = []
    labels = []
    
    print("\n📂 Loading Images...")
    
    # Load stroke images (recursively search all subdirectories)
    stroke_files = []
    for root, dirs, files in os.walk(STROKE_DIR):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                stroke_files.append(os.path.join(root, file))
    
    print(f"Found {len(stroke_files)} stroke images")
    
    for img_path in stroke_files:
        img, label = load_and_preprocess_image(img_path, 1)  # 1 = stroke
        if img is not None:
            # Original image
            images.append(img)
            labels.append(label)
            
            # Enhanced version
            enhanced = enhance_medical_image(img)
            images.append(enhanced)
            labels.append(label)
    
    # Load normal images (recursively search all subdirectories)
    normal_files = []
    for root, dirs, files in os.walk(NORMAL_DIR):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                normal_files.append(os.path.join(root, file))
    
    print(f"Found {len(normal_files)} normal images")
    
    for img_path in normal_files:
        img, label = load_and_preprocess_image(img_path, 0)  # 0 = normal
        if img is not None:
            # Original image
            images.append(img)
            labels.append(label)
            
            # Enhanced version
            enhanced = enhance_medical_image(img)
            images.append(enhanced)
            labels.append(label)
    
    print(f"\n✅ Total images loaded: {len(images)}")
    print(f"   - Stroke: {sum(labels)}")
    print(f"   - Normal: {len(labels) - sum(labels)}")
    
    # Convert to numpy arrays
    X = np.array(images)
    y = np.array(labels)
    
    # Shuffle
    X, y = shuffle(X, y, random_state=42)
    
    return X, y

def create_augmented_generator():
    """Create data augmentation generator for medical images"""
    return ImageDataGenerator(
        rotation_range=10,          # Small rotation
        width_shift_range=0.1,      # Slight horizontal shift
        height_shift_range=0.1,     # Slight vertical shift
        zoom_range=0.1,             # Slight zoom
        horizontal_flip=True,       # Flip horizontally (brain symmetry)
        fill_mode='nearest',
        brightness_range=[0.9, 1.1] # Slight brightness variation
    )

def build_model():
    """Build CNN model with transfer learning"""
    print("\n🏗️ Building Model Architecture...")
    
    # Load MobileNetV2 pre-trained on ImageNet
    base_model = MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model layers initially
    base_model.trainable = False
    
    # Build model
    model = keras.Sequential([
        # Input layer
        layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3)),
        
        # Pre-trained base
        base_model,
        
        # Custom classification head
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.3),
        layers.Dense(512, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.3),
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.2),
        layers.Dense(128, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.2),
        layers.Dense(1, activation='sigmoid', name='output')  # Binary classification
    ])
    
    print("✅ Model architecture created")
    return model

def train_model(X_train, y_train, X_val, y_val):
    """Train the model"""
    print("\n🎯 Starting Training Process...")
    
    # Build model
    model = build_model()
    
    # Compile model
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss='binary_crossentropy',
        metrics=[
            'accuracy',
            keras.metrics.AUC(name='auc'),
            keras.metrics.Precision(name='precision'),
            keras.metrics.Recall(name='recall')
        ]
    )
    
    # Print model summary
    print("\n📊 Model Summary:")
    model.summary()
    
    # Calculate class weights to handle imbalance
    stroke_count = np.sum(y_train)
    normal_count = len(y_train) - stroke_count
    total = len(y_train)
    
    class_weight = {
        0: total / (2 * normal_count),
        1: total / (2 * stroke_count)
    }
    
    print(f"\n⚖️ Class Weights: {class_weight}")
    
    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True,
            verbose=1
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7,
            verbose=1
        ),
        keras.callbacks.ModelCheckpoint(
            MODEL_PATH,
            monitor='val_auc',
            mode='max',
            save_best_only=True,
            verbose=1
        )
    ]
    
    # Data augmentation
    train_datagen = create_augmented_generator()
    
    print(f"\n🚀 Training for {EPOCHS} epochs...")
    print(f"   Batch size: {BATCH_SIZE}")
    print(f"   Learning rate: {LEARNING_RATE}")
    
    # Train
    history = model.fit(
        train_datagen.flow(X_train, y_train, batch_size=BATCH_SIZE),
        validation_data=(X_val, y_val),
        epochs=EPOCHS,
        class_weight=class_weight,
        callbacks=callbacks,
        verbose=1
    )
    
    return model, history

def evaluate_model(model, X_test, y_test):
    """Evaluate the trained model"""
    print("\n" + "=" * 50)
    print("EVALUATION ON TEST SET")
    print("=" * 50)
    
    # Evaluate
    results = model.evaluate(X_test, y_test, verbose=0)
    
    print(f"\nTest Loss: {results[0]:.4f}")
    print(f"Test Accuracy: {results[1]:.4f}")
    print(f"Test AUC: {results[2]:.4f}")
    print(f"Test Precision: {results[3]:.4f}")
    print(f"Test Recall: {results[4]:.4f}")
    
    # Predictions
    predictions = model.predict(X_test, verbose=0)
    pred_classes = (predictions > 0.5).astype(int)
    
    # Confusion matrix
    from sklearn.metrics import confusion_matrix, classification_report
    
    cm = confusion_matrix(y_test, pred_classes)
    print("\n📊 Confusion Matrix:")
    print("                Predicted")
    print("              Normal  Stroke")
    print(f"Actual Normal   {cm[0][0]:4d}    {cm[0][1]:4d}")
    print(f"       Stroke   {cm[1][0]:4d}    {cm[1][1]:4d}")
    
    print("\n📈 Classification Report:")
    print(classification_report(y_test, pred_classes, target_names=['Normal', 'Stroke']))

def plot_training_history(history):
    """Plot training history"""
    try:
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        
        # Accuracy
        axes[0, 0].plot(history.history['accuracy'], label='Train')
        axes[0, 0].plot(history.history['val_accuracy'], label='Validation')
        axes[0, 0].set_title('Model Accuracy')
        axes[0, 0].set_xlabel('Epoch')
        axes[0, 0].set_ylabel('Accuracy')
        axes[0, 0].legend()
        axes[0, 0].grid(True)
        
        # Loss
        axes[0, 1].plot(history.history['loss'], label='Train')
        axes[0, 1].plot(history.history['val_loss'], label='Validation')
        axes[0, 1].set_title('Model Loss')
        axes[0, 1].set_xlabel('Epoch')
        axes[0, 1].set_ylabel('Loss')
        axes[0, 1].legend()
        axes[0, 1].grid(True)
        
        # AUC
        axes[1, 0].plot(history.history['auc'], label='Train')
        axes[1, 0].plot(history.history['val_auc'], label='Validation')
        axes[1, 0].set_title('Model AUC')
        axes[1, 0].set_xlabel('Epoch')
        axes[1, 0].set_ylabel('AUC')
        axes[1, 0].legend()
        axes[1, 0].grid(True)
        
        # Precision & Recall
        axes[1, 1].plot(history.history['precision'], label='Precision')
        axes[1, 1].plot(history.history['recall'], label='Recall')
        axes[1, 1].set_title('Precision & Recall')
        axes[1, 1].set_xlabel('Epoch')
        axes[1, 1].set_ylabel('Score')
        axes[1, 1].legend()
        axes[1, 1].grid(True)
        
        plt.tight_layout()
        plt.savefig('models/training_history.png', dpi=150)
        print("\n📊 Training history plot saved to: models/training_history.png")
        
    except Exception as e:
        print(f"⚠️ Could not plot training history: {e}")

def main():
    """Main training pipeline"""
    
    # Check if directories exist and have images
    if not os.path.exists(STROKE_DIR) or not os.path.exists(NORMAL_DIR):
        print("❌ Error: Training directories not found!")
        print("\nPlease create the following structure:")
        print("  backend/training_data/")
        print("    ├── stroke/  (put stroke brain scans here)")
        print("    └── normal/  (put normal brain scans here)")
        return
    
    # Count images recursively in all subdirectories
    stroke_count = 0
    for root, dirs, files in os.walk(STROKE_DIR):
        stroke_count += len([f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
    
    normal_count = 0
    for root, dirs, files in os.walk(NORMAL_DIR):
        normal_count += len([f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
    
    if stroke_count == 0 or normal_count == 0:
        print("❌ Error: No images found in training directories!")
        print(f"\n📊 Current status:")
        print(f"   Stroke images: {stroke_count}")
        print(f"   Normal images: {normal_count}")
        print("\nPlease add images to:")
        print(f"   {os.path.abspath(STROKE_DIR)}")
        print(f"   {os.path.abspath(NORMAL_DIR)}")
        return
    
    print(f"\n📊 Dataset Overview:")
    print(f"   Stroke images: {stroke_count}")
    print(f"   Normal images: {normal_count}")
    print(f"   Total (with augmentation): {(stroke_count + normal_count) * 2}")
    
    # Load dataset
    X, y = load_dataset()
    
    if len(X) < 10:
        print("\n⚠️ Warning: Very small dataset! Results may not be reliable.")
        print("   Recommend at least 50+ images per class for good performance.")
    
    # Split data: 70% train, 15% validation, 15% test
    X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.15, random_state=42, stratify=y)
    X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.176, random_state=42, stratify=y_temp)
    
    print(f"\n📊 Data Split:")
    print(f"   Training: {len(X_train)} images")
    print(f"   Validation: {len(X_val)} images")
    print(f"   Test: {len(X_test)} images")
    
    # Create models directory
    os.makedirs('models', exist_ok=True)
    
    # Train model
    model, history = train_model(X_train, y_train, X_val, y_val)
    
    # Evaluate
    evaluate_model(model, X_test, y_test)
    
    # Plot history
    plot_training_history(history)
    
    # Save final model
    model.save(MODEL_PATH)
    
    # Check model size
    model_size = os.path.getsize(MODEL_PATH) / (1024 * 1024)
    print(f"\n✅ Model saved successfully to: {MODEL_PATH}")
    print(f"✅ Model size: {model_size:.2f} MB")
    
    print("\n" + "=" * 50)
    print("MODEL READY FOR DEPLOYMENT")
    print("=" * 50)
    print("\n✅ Training complete!")
    print("   Restart the backend server to use the new model:")
    print("   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000")

if __name__ == "__main__":
    main()
