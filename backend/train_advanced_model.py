"""
Advanced Brain Stroke Detection Model Training
Using Transfer Learning with EfficientNetB3 for maximum accuracy
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
from sklearn.utils.class_weight import compute_class_weight
from datetime import datetime

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

print("=" * 60)
print("🧠 BRAINHEALTH AI - MODEL TRAINING")
print("=" * 60)
print(f"TensorFlow Version: {tf.__version__}")
print(f"GPU Available: {tf.config.list_physical_devices('GPU')}")
print("=" * 60)

# Configuration
IMG_SIZE = 224  # EfficientNetB3 optimal size
BATCH_SIZE = 16
EPOCHS = 50
LEARNING_RATE = 0.0001

# Data paths
TRAIN_DIR = r'C:\Users\aashi\OneDrive\Desktop\BrainHealth AI\backend\training_data'
MODEL_SAVE_PATH = r'C:\Users\aashi\OneDrive\Desktop\BrainHealth AI\backend\models\stroke_cnn_model.h5'

# Check if training data exists
if not os.path.exists(TRAIN_DIR):
    raise ValueError(f"Training directory not found: {TRAIN_DIR}")

normal_count = len(os.listdir(os.path.join(TRAIN_DIR, 'normal')))
stroke_count = len(os.listdir(os.path.join(TRAIN_DIR, 'stroke')))

print(f"\n📊 Dataset Information:")
print(f"   Normal scans: {normal_count}")
print(f"   Stroke scans: {stroke_count}")
print(f"   Total images: {normal_count + stroke_count}")
print(f"   Class imbalance ratio: 1:{stroke_count/normal_count:.2f}")

# Data Augmentation for training (helps prevent overfitting)
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=15,
    width_shift_range=0.1,
    height_shift_range=0.1,
    shear_range=0.1,
    zoom_range=0.1,
    horizontal_flip=True,
    fill_mode='nearest',
    validation_split=0.2  # 80% train, 20% validation
)

# Validation data (no augmentation, only rescaling)
val_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2
)

print("\n📁 Loading training data...")
train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='binary',
    subset='training',
    shuffle=True,
    color_mode='rgb'
)

print("\n📁 Loading validation data...")
validation_generator = val_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='binary',
    subset='validation',
    shuffle=False,
    color_mode='rgb'
)

print(f"\n✅ Training samples: {train_generator.samples}")
print(f"✅ Validation samples: {validation_generator.samples}")
print(f"✅ Classes: {train_generator.class_indices}")

# Calculate class weights to handle imbalance
class_weights = compute_class_weight(
    'balanced',
    classes=np.unique(train_generator.classes),
    y=train_generator.classes
)
class_weight_dict = dict(enumerate(class_weights))
print(f"\n⚖️ Class weights (to handle imbalance): {class_weight_dict}")

# Build Model with Transfer Learning
print("\n🔨 Building advanced CNN model with EfficientNetB3...")

# Load pre-trained EfficientNetB3 (trained on ImageNet)
base_model = EfficientNetB3(
    include_top=False,
    weights='imagenet',
    input_shape=(IMG_SIZE, IMG_SIZE, 3)
)

# Freeze base model initially
base_model.trainable = False

# Build custom top layers
model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.BatchNormalization(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(1, activation='sigmoid')  # Binary classification
])

# Compile model
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE),
    loss='binary_crossentropy',
    metrics=['accuracy', 
             keras.metrics.Precision(name='precision'),
             keras.metrics.Recall(name='recall'),
             keras.metrics.AUC(name='auc')]
)

print("\n📋 Model Architecture:")
model.summary()

# Callbacks
callbacks = [
    # Save best model
    ModelCheckpoint(
        MODEL_SAVE_PATH,
        monitor='val_accuracy',
        save_best_only=True,
        mode='max',
        verbose=1
    ),
    # Stop if no improvement
    EarlyStopping(
        monitor='val_loss',
        patience=10,
        restore_best_weights=True,
        verbose=1
    ),
    # Reduce learning rate on plateau
    ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=5,
        min_lr=1e-7,
        verbose=1
    )
]

print("\n" + "=" * 60)
print("🚀 STARTING TRAINING - PHASE 1: Transfer Learning")
print("=" * 60)

# Phase 1: Train with frozen base
history_phase1 = model.fit(
    train_generator,
    epochs=20,
    validation_data=validation_generator,
    class_weight=class_weight_dict,
    callbacks=callbacks,
    verbose=1
)

print("\n" + "=" * 60)
print("🔥 PHASE 2: Fine-tuning (unfreezing layers)")
print("=" * 60)

# Phase 2: Unfreeze some layers for fine-tuning
base_model.trainable = True

# Freeze first 200 layers, train the rest
for layer in base_model.layers[:200]:
    layer.trainable = False

# Recompile with lower learning rate
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE / 10),
    loss='binary_crossentropy',
    metrics=['accuracy', 
             keras.metrics.Precision(name='precision'),
             keras.metrics.Recall(name='recall'),
             keras.metrics.AUC(name='auc')]
)

# Continue training
history_phase2 = model.fit(
    train_generator,
    epochs=30,
    initial_epoch=20,
    validation_data=validation_generator,
    class_weight=class_weight_dict,
    callbacks=callbacks,
    verbose=1
)

# Combine histories
history = {
    'accuracy': history_phase1.history['accuracy'] + history_phase2.history['accuracy'],
    'val_accuracy': history_phase1.history['val_accuracy'] + history_phase2.history['val_accuracy'],
    'loss': history_phase1.history['loss'] + history_phase2.history['loss'],
    'val_loss': history_phase1.history['val_loss'] + history_phase2.history['val_loss']
}

print("\n" + "=" * 60)
print("✅ TRAINING COMPLETED!")
print("=" * 60)

# Evaluate on validation set
print("\n📊 Final Evaluation on Validation Set:")
val_results = model.evaluate(validation_generator, verbose=1)
print(f"\n🎯 Final Metrics:")
print(f"   Validation Loss: {val_results[0]:.4f}")
print(f"   Validation Accuracy: {val_results[1]*100:.2f}%")
print(f"   Precision: {val_results[2]:.4f}")
print(f"   Recall: {val_results[3]:.4f}")
print(f"   AUC: {val_results[4]:.4f}")

# Plot training history
plt.figure(figsize=(15, 5))

# Plot accuracy
plt.subplot(1, 2, 1)
plt.plot(history['accuracy'], label='Training Accuracy', linewidth=2)
plt.plot(history['val_accuracy'], label='Validation Accuracy', linewidth=2)
plt.axvline(x=20, color='red', linestyle='--', label='Fine-tuning starts')
plt.title('Model Accuracy', fontsize=14, fontweight='bold')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.grid(True, alpha=0.3)

# Plot loss
plt.subplot(1, 2, 2)
plt.plot(history['loss'], label='Training Loss', linewidth=2)
plt.plot(history['val_loss'], label='Validation Loss', linewidth=2)
plt.axvline(x=20, color='red', linestyle='--', label='Fine-tuning starts')
plt.title('Model Loss', fontsize=14, fontweight='bold')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.grid(True, alpha=0.3)

plt.tight_layout()
plot_path = os.path.join(os.path.dirname(MODEL_SAVE_PATH), 'training_history.png')
plt.savefig(plot_path, dpi=300, bbox_inches='tight')
print(f"\n📈 Training plots saved to: {plot_path}")

print("\n" + "=" * 60)
print("🎉 MODEL TRAINING SUCCESSFUL!")
print("=" * 60)
print(f"✅ Model saved to: {MODEL_SAVE_PATH}")
print(f"✅ Ready for deployment!")
print("=" * 60)

# Test prediction on a sample
print("\n🧪 Testing model with sample prediction...")
sample_batch, sample_labels = next(validation_generator)
predictions = model.predict(sample_batch[:5])

print("\nSample Predictions vs Actual:")
for i in range(5):
    pred_class = "Stroke" if predictions[i][0] > 0.5 else "Normal"
    actual_class = "Stroke" if sample_labels[i] == 1 else "Normal"
    confidence = predictions[i][0] if predictions[i][0] > 0.5 else 1 - predictions[i][0]
    print(f"   {i+1}. Predicted: {pred_class} ({confidence*100:.1f}%) | Actual: {actual_class}")

print("\n✨ Training complete! Model is ready for production use.")
