"""
Advanced Brain Stroke Detection Model Training
Uses Transfer Learning with Data Augmentation for High Accuracy
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from sklearn.model_selection import train_test_split
from sklearn.utils import class_weight
import matplotlib.pyplot as plt
from datetime import datetime
import cv2
from pathlib import Path

# Configuration
IMG_SIZE = 224  # Standard for EfficientNet
BATCH_SIZE = 16
EPOCHS = 50
LEARNING_RATE = 0.0001

# Paths
DATA_DIR = Path('training_data')
MODEL_SAVE_PATH = 'models/stroke_cnn_model.h5'
HISTORY_PATH = 'models/training_history.png'

print("=" * 60)
print("🧠 BRAINHEALTH AI - MODEL TRAINING")
print("=" * 60)
print(f"📊 Image Size: {IMG_SIZE}x{IMG_SIZE}")
print(f"📦 Batch Size: {BATCH_SIZE}")
print(f"🔄 Epochs: {EPOCHS}")
print("=" * 60)

# Load and preprocess data
def load_and_preprocess_images():
    """Load images with grayscale verification"""
    X = []
    y = []
    
    # Load normal scans
    normal_dir = DATA_DIR / 'normal'
    print(f"\n📁 Loading normal scans from: {normal_dir}")
    normal_files = list(normal_dir.glob('*.jpg')) + list(normal_dir.glob('*.png'))
    print(f"   Found {len(normal_files)} normal images")
    
    for img_path in normal_files:
        img = cv2.imread(str(img_path))
        if img is None:
            continue
        
        # Convert to grayscale if needed
        if len(img.shape) == 3:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Resize and normalize
        img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
        img = img / 255.0
        
        # Convert to 3 channels for EfficientNet
        img = np.stack([img] * 3, axis=-1)
        
        X.append(img)
        y.append(0)  # 0 for normal
    
    # Load stroke scans
    stroke_dir = DATA_DIR / 'stroke'
    print(f"\n📁 Loading stroke scans from: {stroke_dir}")
    stroke_files = list(stroke_dir.glob('*.jpg')) + list(stroke_dir.glob('*.png'))
    print(f"   Found {len(stroke_files)} stroke images")
    
    for img_path in stroke_files:
        img = cv2.imread(str(img_path))
        if img is None:
            continue
        
        # Convert to grayscale if needed
        if len(img.shape) == 3:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Resize and normalize
        img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
        img = img / 255.0
        
        # Convert to 3 channels
        img = np.stack([img] * 3, axis=-1)
        
        X.append(img)
        y.append(1)  # 1 for stroke
    
    X = np.array(X, dtype=np.float32)
    y = np.array(y, dtype=np.int32)
    
    print(f"\n✅ Total images loaded: {len(X)}")
    print(f"   Normal: {np.sum(y == 0)}")
    print(f"   Stroke: {np.sum(y == 1)}")
    
    return X, y

# Build improved model with transfer learning
def build_model():
    """Build model using EfficientNetB0 with transfer learning"""
    print("\n🏗️  Building model with EfficientNetB0...")
    
    # Load pre-trained EfficientNet
    base_model = EfficientNetB0(
        include_top=False,
        weights='imagenet',
        input_shape=(IMG_SIZE, IMG_SIZE, 3)
    )
    
    # Freeze base model initially
    base_model.trainable = False
    
    # Build model
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(256, activation='relu', kernel_regularizer=keras.regularizers.l2(0.001)),
        layers.BatchNormalization(),
        layers.Dropout(0.4),
        layers.Dense(128, activation='relu', kernel_regularizer=keras.regularizers.l2(0.001)),
        layers.Dropout(0.3),
        layers.Dense(1, activation='sigmoid')
    ])
    
    # Compile
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss='binary_crossentropy',
        metrics=['accuracy', keras.metrics.Precision(), keras.metrics.Recall(), keras.metrics.AUC()]
    )
    
    print("✅ Model built successfully!")
    model.summary()
    
    return model, base_model

# Data augmentation
def create_data_generators():
    """Create augmented data generators"""
    print("\n🔄 Setting up data augmentation...")
    
    train_datagen = ImageDataGenerator(
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True,
        fill_mode='nearest',
        brightness_range=[0.8, 1.2]
    )
    
    val_datagen = ImageDataGenerator()  # No augmentation for validation
    
    return train_datagen, val_datagen

# Training
def train_model():
    """Main training function"""
    
    # Load data
    X, y = load_and_preprocess_images()
    
    # Split data (70% train, 15% val, 15% test)
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
    )
    
    print(f"\n📊 Data Split:")
    print(f"   Training: {len(X_train)} images")
    print(f"   Validation: {len(X_val)} images")
    print(f"   Test: {len(X_test)} images")
    
    # Calculate class weights to handle imbalance
    class_weights = class_weight.compute_class_weight(
        'balanced',
        classes=np.unique(y_train),
        y=y_train
    )
    class_weights = {i: class_weights[i] for i in range(len(class_weights))}
    print(f"\n⚖️  Class weights: {class_weights}")
    
    # Build model
    model, base_model = build_model()
    
    # Create data generators
    train_datagen, val_datagen = create_data_generators()
    
    # Callbacks
    callbacks = [
        ModelCheckpoint(
            MODEL_SAVE_PATH,
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7,
            verbose=1
        )
    ]
    
    # Phase 1: Train with frozen base
    print("\n" + "=" * 60)
    print("🎯 PHASE 1: Training with frozen base model")
    print("=" * 60)
    
    history1 = model.fit(
        train_datagen.flow(X_train, y_train, batch_size=BATCH_SIZE),
        validation_data=(X_val, y_val),
        epochs=20,
        class_weight=class_weights,
        callbacks=callbacks,
        verbose=1
    )
    
    # Phase 2: Fine-tune last layers
    print("\n" + "=" * 60)
    print("🎯 PHASE 2: Fine-tuning model")
    print("=" * 60)
    
    # Unfreeze last 20 layers
    base_model.trainable = True
    for layer in base_model.layers[:-20]:
        layer.trainable = False
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE/10),
        loss='binary_crossentropy',
        metrics=['accuracy', keras.metrics.Precision(), keras.metrics.Recall(), keras.metrics.AUC()]
    )
    
    history2 = model.fit(
        train_datagen.flow(X_train, y_train, batch_size=BATCH_SIZE),
        validation_data=(X_val, y_val),
        epochs=30,
        class_weight=class_weights,
        callbacks=callbacks,
        verbose=1
    )
    
    # Evaluate on test set
    print("\n" + "=" * 60)
    print("📊 FINAL EVALUATION ON TEST SET")
    print("=" * 60)
    
    test_loss, test_acc, test_prec, test_rec, test_auc = model.evaluate(X_test, y_test, verbose=0)
    
    print(f"✅ Test Accuracy: {test_acc*100:.2f}%")
    print(f"✅ Test Precision: {test_prec*100:.2f}%")
    print(f"✅ Test Recall: {test_rec*100:.2f}%")
    print(f"✅ Test AUC: {test_auc*100:.2f}%")
    
    # F1 Score
    f1_score = 2 * (test_prec * test_rec) / (test_prec + test_rec)
    print(f"✅ Test F1-Score: {f1_score*100:.2f}%")
    
    # Plot training history
    plot_training_history(history1, history2)
    
    # Make predictions on test set
    predictions = model.predict(X_test)
    predicted_classes = (predictions > 0.5).astype(int).flatten()
    
    # Confusion matrix
    from sklearn.metrics import confusion_matrix, classification_report
    cm = confusion_matrix(y_test, predicted_classes)
    
    print(f"\n📊 Confusion Matrix:")
    print(f"   True Negatives:  {cm[0][0]}")
    print(f"   False Positives: {cm[0][1]}")
    print(f"   False Negatives: {cm[1][0]}")
    print(f"   True Positives:  {cm[1][1]}")
    
    print(f"\n📋 Classification Report:")
    print(classification_report(y_test, predicted_classes, target_names=['Normal', 'Stroke']))
    
    print("\n" + "=" * 60)
    print("🎉 TRAINING COMPLETED SUCCESSFULLY!")
    print(f"💾 Model saved to: {MODEL_SAVE_PATH}")
    print("=" * 60)

def plot_training_history(history1, history2):
    """Plot and save training history"""
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    
    # Combine histories
    history = {
        'accuracy': history1.history['accuracy'] + history2.history['accuracy'],
        'val_accuracy': history1.history['val_accuracy'] + history2.history['val_accuracy'],
        'loss': history1.history['loss'] + history2.history['loss'],
        'val_loss': history1.history['val_loss'] + history2.history['val_loss'],
    }
    
    # Accuracy
    axes[0, 0].plot(history['accuracy'], label='Train')
    axes[0, 0].plot(history['val_accuracy'], label='Validation')
    axes[0, 0].set_title('Model Accuracy')
    axes[0, 0].set_xlabel('Epoch')
    axes[0, 0].set_ylabel('Accuracy')
    axes[0, 0].legend()
    axes[0, 0].grid(True)
    
    # Loss
    axes[0, 1].plot(history['loss'], label='Train')
    axes[0, 1].plot(history['val_loss'], label='Validation')
    axes[0, 1].set_title('Model Loss')
    axes[0, 1].set_xlabel('Epoch')
    axes[0, 1].set_ylabel('Loss')
    axes[0, 1].legend()
    axes[0, 1].grid(True)
    
    plt.tight_layout()
    plt.savefig(HISTORY_PATH)
    print(f"\n📈 Training history saved to: {HISTORY_PATH}")

if __name__ == '__main__':
    # Create models directory if doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Start training
    train_model()
