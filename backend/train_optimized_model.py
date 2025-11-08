"""
Improved Brain Stroke Detection Model Training
Custom CNN optimized for grayscale medical images
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

# Set random seeds
np.random.seed(42)
tf.random.set_seed(42)

# Configuration
IMG_SIZE = 128
BATCH_SIZE = 32
EPOCHS = 100
LEARNING_RATE = 0.001

# Data paths
TRAIN_DATA_DIR = 'training_data'
MODEL_SAVE_PATH = 'models/stroke_cnn_model.h5'

print("=" * 60)
print("BRAIN STROKE DETECTION - MODEL TRAINING")
print("=" * 60)
print(f"Image Size: {IMG_SIZE}x{IMG_SIZE}")
print(f"Batch Size: {BATCH_SIZE}")
print(f"Max Epochs: {EPOCHS}")
print(f"Learning Rate: {LEARNING_RATE}")
print("=" * 60)

# Data Augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=15,
    width_shift_range=0.15,
    height_shift_range=0.15,
    shear_range=0.15,
    zoom_range=0.15,
    horizontal_flip=True,
    brightness_range=[0.8, 1.2],
    fill_mode='nearest',
    validation_split=0.2
)

# Load data
print("\n📂 Loading Training Data...")
train_generator = train_datagen.flow_from_directory(
    TRAIN_DATA_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='binary',
    color_mode='grayscale',
    subset='training',
    shuffle=True
)

print("📂 Loading Validation Data...")
validation_generator = train_datagen.flow_from_directory(
    TRAIN_DATA_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='binary',
    color_mode='grayscale',
    subset='validation',
    shuffle=True
)

print(f"\n✅ Found {train_generator.samples} training images")
print(f"✅ Found {validation_generator.samples} validation images")
print(f"📊 Classes: {train_generator.class_indices}")

# Build improved CNN model
print("\n🏗️ Building Enhanced CNN Model...")

model = models.Sequential([
    # Input
    layers.Input(shape=(IMG_SIZE, IMG_SIZE, 1)),
    
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
    layers.Dropout(0.4),
    
    # Dense layers
    layers.Flatten(),
    layers.Dense(512, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.5),
    layers.Dense(256, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.5),
    layers.Dense(1, activation='sigmoid')
])

# Compile
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE),
    loss='binary_crossentropy',
    metrics=['accuracy', keras.metrics.Precision(), keras.metrics.Recall()]
)

print("\n📋 Model Architecture:")
model.summary()

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
        patience=15,
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

# Train
print("\n" + "=" * 60)
print("🚀 STARTING TRAINING")
print("=" * 60)

history = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=EPOCHS,
    callbacks=callbacks,
    verbose=1
)

# Evaluate
print("\n" + "=" * 60)
print("📊 FINAL EVALUATION")
print("=" * 60)

val_loss, val_accuracy, val_precision, val_recall = model.evaluate(validation_generator)
f1_score = 2 * (val_precision * val_recall) / (val_precision + val_recall + 1e-7)

print(f"\n✅ Validation Accuracy: {val_accuracy*100:.2f}%")
print(f"✅ Validation Precision: {val_precision*100:.2f}%")
print(f"✅ Validation Recall: {val_recall*100:.2f}%")
print(f"✅ F1 Score: {f1_score*100:.2f}%")

# Confusion Matrix
print("\n🔍 Generating Confusion Matrix...")
val_predictions = model.predict(validation_generator)
val_predictions = (val_predictions > 0.5).astype(int)
val_true_labels = validation_generator.classes

cm = confusion_matrix(val_true_labels, val_predictions)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['Normal', 'Stroke'], yticklabels=['Normal', 'Stroke'])
plt.title(f'Confusion Matrix\nAccuracy: {val_accuracy*100:.2f}%')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.savefig('models/confusion_matrix.png', dpi=150, bbox_inches='tight')
print("✅ Confusion matrix saved")

# Plot history
print("\n📈 Plotting Training History...")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))

ax1.plot(history.history['accuracy'], label='Training Accuracy', linewidth=2)
ax1.plot(history.history['val_accuracy'], label='Validation Accuracy', linewidth=2)
ax1.set_title('Model Accuracy', fontsize=14, fontweight='bold')
ax1.set_xlabel('Epoch')
ax1.set_ylabel('Accuracy')
ax1.legend()
ax1.grid(True, alpha=0.3)

ax2.plot(history.history['loss'], label='Training Loss', linewidth=2)
ax2.plot(history.history['val_loss'], label='Validation Loss', linewidth=2)
ax2.set_title('Model Loss', fontsize=14, fontweight='bold')
ax2.set_xlabel('Epoch')
ax2.set_ylabel('Loss')
ax2.legend()
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('models/training_history.png', dpi=150, bbox_inches='tight')
print("✅ Training history saved")

print("\n" + "=" * 60)
print("🎉 TRAINING COMPLETED SUCCESSFULLY!")
print("=" * 60)
print(f"Final Model Performance:")
print(f"  • Accuracy: {val_accuracy*100:.2f}%")
print(f"  • Precision: {val_precision*100:.2f}%")
print(f"  • Recall: {val_recall*100:.2f}%")
print(f"  • F1 Score: {f1_score*100:.2f}%")
print(f"\nModel saved to: {MODEL_SAVE_PATH}")
print("=" * 60)
