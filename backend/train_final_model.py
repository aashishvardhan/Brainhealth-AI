"""
Improved Brain Stroke Detection Model Training
Uses EfficientNetB3 with transfer learning for better accuracy
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras.applications import EfficientNetB3
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

# Configuration
IMG_SIZE = 224
BATCH_SIZE = 16
EPOCHS = 50
LEARNING_RATE = 0.0001

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

# Data Augmentation for training
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest',
    validation_split=0.2  # 80% train, 20% validation
)

# Load training data (RGB mode for EfficientNet compatibility)
print("\n📂 Loading Training Data...")
train_generator = train_datagen.flow_from_directory(
    TRAIN_DATA_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='binary',
    color_mode='rgb',  # Changed to RGB
    subset='training',
    shuffle=True
)

# Load validation data
print("📂 Loading Validation Data...")
validation_generator = train_datagen.flow_from_directory(
    TRAIN_DATA_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='binary',
    color_mode='rgb',  # Changed to RGB
    subset='validation',
    shuffle=True
)

print(f"\n✅ Found {train_generator.samples} training images")
print(f"✅ Found {validation_generator.samples} validation images")
print(f"📊 Classes: {train_generator.class_indices}")

# Build model with EfficientNetB3 transfer learning
print("\n🏗️ Building Model with EfficientNetB3 Transfer Learning...")

# Load pre-trained EfficientNetB3 (convert grayscale to RGB)
base_model = EfficientNetB3(
    include_top=False,
    weights='imagenet',
    input_shape=(IMG_SIZE, IMG_SIZE, 3),
    pooling='avg'
)

# Freeze base model layers initially
base_model.trainable = False

# Build model
model = models.Sequential([
    # Input layer
    layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3)),
    
    # Pre-trained EfficientNetB3
    base_model,
    
    # Custom classification head
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(1, activation='sigmoid')
])

# Compile model
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

# Train model (Phase 1: Frozen base)
print("\n" + "=" * 60)
print("🚀 PHASE 1: Training with frozen base model")
print("=" * 60)

history_phase1 = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=20,
    callbacks=callbacks,
    verbose=1
)

# Fine-tuning (Phase 2: Unfreeze base)
print("\n" + "=" * 60)
print("🚀 PHASE 2: Fine-tuning (unfreezing base model)")
print("=" * 60)

# Unfreeze the last 20 layers of base model
base_model.trainable = True
for layer in base_model.layers[:-20]:
    layer.trainable = False

# Recompile with lower learning rate
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE/10),
    loss='binary_crossentropy',
    metrics=['accuracy', keras.metrics.Precision(), keras.metrics.Recall()]
)

history_phase2 = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=30,
    callbacks=callbacks,
    verbose=1,
    initial_epoch=20
)

# Combine histories
history = {
    'accuracy': history_phase1.history['accuracy'] + history_phase2.history['accuracy'],
    'val_accuracy': history_phase1.history['val_accuracy'] + history_phase2.history['val_accuracy'],
    'loss': history_phase1.history['loss'] + history_phase2.history['loss'],
    'val_loss': history_phase1.history['val_loss'] + history_phase2.history['val_loss']
}

# Evaluate on validation set
print("\n" + "=" * 60)
print("📊 FINAL EVALUATION")
print("=" * 60)

val_loss, val_accuracy, val_precision, val_recall = model.evaluate(validation_generator)
f1_score = 2 * (val_precision * val_recall) / (val_precision + val_recall)

print(f"\n✅ Validation Accuracy: {val_accuracy*100:.2f}%")
print(f"✅ Validation Precision: {val_precision*100:.2f}%")
print(f"✅ Validation Recall: {val_recall*100:.2f}%")
print(f"✅ F1 Score: {f1_score*100:.2f}%")

# Generate predictions for confusion matrix
print("\n🔍 Generating Confusion Matrix...")
val_predictions = model.predict(validation_generator)
val_predictions = (val_predictions > 0.5).astype(int)
val_true_labels = validation_generator.classes

# Confusion Matrix
cm = confusion_matrix(val_true_labels, val_predictions)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.savefig('models/confusion_matrix.png')
print("✅ Confusion matrix saved to models/confusion_matrix.png")

# Plot training history
print("\n📈 Plotting Training History...")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))

# Accuracy
ax1.plot(history['accuracy'], label='Training Accuracy')
ax1.plot(history['val_accuracy'], label='Validation Accuracy')
ax1.set_title('Model Accuracy')
ax1.set_xlabel('Epoch')
ax1.set_ylabel('Accuracy')
ax1.legend()
ax1.grid(True)

# Loss
ax2.plot(history['loss'], label='Training Loss')
ax2.plot(history['val_loss'], label='Validation Loss')
ax2.set_title('Model Loss')
ax2.set_xlabel('Epoch')
ax2.set_ylabel('Loss')
ax2.legend()
ax2.grid(True)

plt.tight_layout()
plt.savefig('models/training_history.png')
print("✅ Training history saved to models/training_history.png")

# Save model
model.save(MODEL_SAVE_PATH)
print(f"\n✅ Model saved to {MODEL_SAVE_PATH}")

print("\n" + "=" * 60)
print("🎉 TRAINING COMPLETED SUCCESSFULLY!")
print("=" * 60)
print(f"Final Model Performance:")
print(f"  • Accuracy: {val_accuracy*100:.2f}%")
print(f"  • Precision: {val_precision*100:.2f}%")
print(f"  • Recall: {val_recall*100:.2f}%")
print(f"  • F1 Score: {f1_score*100:.2f}%")
print("=" * 60)
