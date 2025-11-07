"""
Brain Stroke Detection CNN Model Training Script

This script creates and trains a Convolutional Neural Network (CNN)
for detecting brain strokes from MRI/CT scan images.

Dataset: Use publicly available datasets like:
- Kaggle Brain Stroke Dataset
- NIH Stroke Dataset
- Custom curated dataset

For demo purposes, this creates a model architecture.
In production, train on real medical imaging data.
"""

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import os

print("TensorFlow version:", tf.__version__)

# ==================== Configuration ====================

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 50
LEARNING_RATE = 0.001

# Paths
MODEL_DIR = 'models'
MODEL_PATH = os.path.join(MODEL_DIR, 'stroke_cnn_model.h5')

# Create models directory
os.makedirs(MODEL_DIR, exist_ok=True)

# ==================== Build CNN Model ====================

def create_stroke_detection_model(input_shape=(224, 224, 3)):
    """
    Create a CNN model for brain stroke detection
    
    Architecture:
    - Multiple Convolutional blocks with MaxPooling
    - Batch Normalization for stability
    - Dropout for regularization
    - Dense layers for classification
    """
    
    model = models.Sequential([
        # Input layer
        layers.Input(shape=input_shape),
        
        # Block 1
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Block 2
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Block 3
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Block 4
        layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        # Flatten and Dense layers
        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        
        # Output layer (binary classification)
        layers.Dense(1, activation='sigmoid')
    ])
    
    return model

# ==================== Alternative: Transfer Learning ====================

def create_transfer_learning_model(input_shape=(224, 224, 3)):
    """
    Create model using transfer learning with pre-trained base
    Better for small datasets
    """
    
    # Use pre-trained MobileNetV2 (lightweight, good for deployment)
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model layers
    base_model.trainable = False
    
    # Add custom classification layers
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(128, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(1, activation='sigmoid')
    ])
    
    return model

# ==================== Data Preparation ====================

def create_data_generators(train_dir, val_dir):
    """
    Create data generators for training and validation
    
    Includes data augmentation for training set
    """
    
    # Training data augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest'
    )
    
    # Validation data (only rescaling)
    val_datagen = ImageDataGenerator(rescale=1./255)
    
    # Create generators
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='binary',
        shuffle=True
    )
    
    val_generator = val_datagen.flow_from_directory(
        val_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='binary',
        shuffle=False
    )
    
    return train_generator, val_generator

# ==================== Callbacks ====================

def get_callbacks():
    """Training callbacks"""
    
    checkpoint = ModelCheckpoint(
        MODEL_PATH,
        monitor='val_accuracy',
        save_best_only=True,
        mode='max',
        verbose=1
    )
    
    early_stop = EarlyStopping(
        monitor='val_loss',
        patience=10,
        restore_best_weights=True,
        verbose=1
    )
    
    reduce_lr = ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=5,
        min_lr=1e-7,
        verbose=1
    )
    
    return [checkpoint, early_stop, reduce_lr]

# ==================== Training Function ====================

def train_model(train_dir, val_dir, use_transfer_learning=True):
    """
    Train the stroke detection model
    
    Args:
        train_dir: Path to training data directory
        val_dir: Path to validation data directory
        use_transfer_learning: Use transfer learning (recommended)
    """
    
    print("🧠 Creating model...")
    if use_transfer_learning:
        model = create_transfer_learning_model()
        print("✅ Using Transfer Learning (MobileNetV2)")
    else:
        model = create_stroke_detection_model()
        print("✅ Using Custom CNN")
    
    # Compile model
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss='binary_crossentropy',
        metrics=['accuracy', 'AUC', 'Precision', 'Recall']
    )
    
    # Print model summary
    model.summary()
    
    print("\n📊 Preparing data...")
    train_generator, val_generator = create_data_generators(train_dir, val_dir)
    
    print(f"Training samples: {train_generator.samples}")
    print(f"Validation samples: {val_generator.samples}")
    
    print("\n🚀 Starting training...")
    history = model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=val_generator,
        callbacks=get_callbacks(),
        verbose=1
    )
    
    print(f"\n✅ Model saved to: {MODEL_PATH}")
    
    return model, history

# ==================== Dummy Data Creation (For Testing) ====================

def create_dummy_model():
    """
    Create and save a dummy model for testing
    Use this if you don't have training data yet
    """
    
    print("🔧 Creating dummy model for testing...")
    
    model = create_transfer_learning_model()
    
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy']
    )
    
    # Create dummy data
    dummy_x = np.random.rand(100, 224, 224, 3).astype('float32')
    dummy_y = np.random.randint(0, 2, 100).astype('float32')
    
    # Train for a few epochs on dummy data
    print("Training on dummy data...")
    model.fit(dummy_x, dummy_y, epochs=3, batch_size=16, verbose=1)
    
    # Save model
    model.save(MODEL_PATH)
    print(f"✅ Dummy model saved to: {MODEL_PATH}")
    print("⚠️ This model is for testing only. Train on real data for production!")
    
    return model

# ==================== Model Evaluation ====================

def evaluate_model(model, test_dir):
    """Evaluate model on test set"""
    
    test_datagen = ImageDataGenerator(rescale=1./255)
    
    test_generator = test_datagen.flow_from_directory(
        test_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='binary',
        shuffle=False
    )
    
    print("\n📊 Evaluating model...")
    results = model.evaluate(test_generator, verbose=1)
    
    print(f"\nTest Loss: {results[0]:.4f}")
    print(f"Test Accuracy: {results[1]:.4f}")
    print(f"Test AUC: {results[2]:.4f}")
    print(f"Test Precision: {results[3]:.4f}")
    print(f"Test Recall: {results[4]:.4f}")
    
    return results

# ==================== Main ====================

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Train Brain Stroke Detection Model')
    parser.add_argument('--train-dir', type=str, help='Path to training data directory')
    parser.add_argument('--val-dir', type=str, help='Path to validation data directory')
    parser.add_argument('--test-dir', type=str, help='Path to test data directory')
    parser.add_argument('--dummy', action='store_true', help='Create dummy model for testing')
    parser.add_argument('--transfer', action='store_true', default=True, help='Use transfer learning')
    
    args = parser.parse_args()
    
    if args.dummy:
        # Create dummy model for testing
        create_dummy_model()
    elif args.train_dir and args.val_dir:
        # Train on real data
        model, history = train_model(
            args.train_dir,
            args.val_dir,
            use_transfer_learning=args.transfer
        )
        
        # Evaluate if test directory provided
        if args.test_dir:
            evaluate_model(model, args.test_dir)
    else:
        print("❌ Error: Provide --train-dir and --val-dir, or use --dummy flag")
        print("\nExamples:")
        print("  # Create dummy model for testing:")
        print("  python train_model.py --dummy")
        print("\n  # Train on real data:")
        print("  python train_model.py --train-dir data/train --val-dir data/val")
        print("\n  # Train and evaluate:")
        print("  python train_model.py --train-dir data/train --val-dir data/val --test-dir data/test")
