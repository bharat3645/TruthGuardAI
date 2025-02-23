import os
import cv2
import librosa
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model, load_model
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, LSTM, TimeDistributed, Dropout, BatchNormalization
from transformers import BertTokenizer, TFBertForSequenceClassification
import re
import pandas as pd

# Enable GPU memory growth (prevents VRAM crash)
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        print("✅ GPU memory growth enabled")
    except RuntimeError as e:
        print(e)

# Constants
IMAGE_SIZE = (224, 224)
AUDIO_SAMPLE_RATE = 16000
MAX_SEQ_LENGTH = 128
# You may adjust batch size as needed
BATCH_SIZE = 8

# ==============================================
# Deepfake Detection Models (FaceForensics++)
# ==============================================

class DeepfakeDetector:
    def __init__(self):
        """Initialize deepfake detection models."""
        self.image_model = self._build_image_model()
        self.video_model = self._build_video_model()
        self.audio_model = self._build_audio_model()

    def _build_image_model(self):
        inputs = Input(shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3))
        x = Conv2D(32, (3, 3), activation="relu", padding="same")(inputs)
        x = MaxPooling2D((2, 2))(x)
        x = BatchNormalization()(x)
        x = Conv2D(64, (3, 3), activation="relu", padding="same")(x)
        x = MaxPooling2D((2, 2))(x)
        x = BatchNormalization()(x)
        x = Flatten()(x)
        x = Dense(128, activation="relu")(x)
        x = Dropout(0.5)(x)
        outputs = Dense(1, activation="sigmoid")(x)
        model = Model(inputs, outputs)
        model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])
        return model

    def _build_video_model(self):
        # Use the image model as a feature extractor for each frame.
        frame_model = self._build_image_model()
        frame_model.trainable = False
        frame_inputs = Input(shape=(None, IMAGE_SIZE[0], IMAGE_SIZE[1], 3))
        x = TimeDistributed(frame_model)(frame_inputs)
        x = LSTM(64, return_sequences=False)(x)
        x = Dense(64, activation="relu")(x)
        outputs = Dense(1, activation="sigmoid")(x)
        model = Model(frame_inputs, outputs)
        model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])
        return model

    def _build_audio_model(self):
        # Input shape: (40, 216, 1) = 40 MFCCs and fixed 216 time frames.
        inputs = Input(shape=(40, 216, 1))
        x = Conv2D(32, (3, 3), activation="relu", padding="same")(inputs)
        x = MaxPooling2D((2, 2))(x)
        x = BatchNormalization()(x)
        x = Conv2D(64, (3, 3), activation="relu", padding="same")(x)
        x = MaxPooling2D((2, 2))(x)
        x = BatchNormalization()(x)
        x = Flatten()(x)
        x = Dense(128, activation="relu")(x)
        x = Dropout(0.5)(x)
        outputs = Dense(1, activation="sigmoid")(x)
        model = Model(inputs, outputs)
        model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])
        return model

    def preprocess_image(self, image_path: str) -> np.ndarray:
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Image not found or cannot be read: {image_path}")
        image = cv2.resize(image, IMAGE_SIZE)
        image = image.astype("float32") / 255.0
        return np.expand_dims(image, axis=0)

    def preprocess_video(self, video_path: str, frame_count: int = 30) -> np.ndarray:
        cap = cv2.VideoCapture(video_path)
        frames = []
        while len(frames) < frame_count:
            ret, frame = cap.read()
            if not ret:
                break
            frame = cv2.resize(frame, IMAGE_SIZE)
            frame = frame.astype("float32") / 255.0
            frames.append(frame)
        cap.release()
        if len(frames) == 0:
            raise ValueError(f"No frames extracted from video: {video_path}")
        return np.expand_dims(frames, axis=0)

    def preprocess_audio(self, audio_path: str) -> np.ndarray:
        y, sr = librosa.load(audio_path, sr=AUDIO_SAMPLE_RATE)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
        expected_frames = 216
        if mfccs.shape[1] < expected_frames:
            pad_width = expected_frames - mfccs.shape[1]
            mfccs = np.pad(mfccs, pad_width=((0, 0), (0, pad_width)), mode='constant')
        elif mfccs.shape[1] > expected_frames:
            mfccs = mfccs[:, :expected_frames]
        mfccs = mfccs.astype("float32")
        mfccs = np.expand_dims(mfccs, axis=-1)
        return np.expand_dims(mfccs, axis=0)

    def detect_image(self, image_path: str) -> float:
        preprocessed_image = self.preprocess_image(image_path)
        confidence = self.image_model.predict(preprocessed_image)[0][0]
        return float(confidence)

    def detect_video(self, video_path: str) -> float:
        preprocessed_video = self.preprocess_video(video_path)
        confidence = self.video_model.predict(preprocessed_video)[0][0]
        return float(confidence)

    def detect_audio(self, audio_path: str) -> float:
        preprocessed_audio = self.preprocess_audio(audio_path)
        confidence = self.audio_model.predict(preprocessed_audio)[0][0]
        return float(confidence)

    def load_models(self, directory: str):
        self.image_model = load_model(os.path.join(directory, "image_model.h5"))
        self.video_model = load_model(os.path.join(directory, "video_model.h5"))
        self.audio_model = load_model(os.path.join(directory, "audio_model.h5"))

    def save_models(self, directory: str):
        os.makedirs(directory, exist_ok=True)
        self.image_model.save(os.path.join(directory, "image_model.h5"))
        self.video_model.save(os.path.join(directory, "video_model.h5"))
        self.audio_model.save(os.path.join(directory, "audio_model.h5"))

# ==============================================
# Fake News Detection Model (FakeNewsNet)
# ==============================================

class FakeNewsDetector:
    def __init__(self):
        self.tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
        self.model = TFBertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)
        self.suspicious_keywords = ["fake", "hoax", "conspiracy", "fabricated", "misleading"]

    def preprocess_text(self, text: str) -> dict:
        inputs = self.tokenizer(text, padding="max_length", truncation=True,
                                max_length=MAX_SEQ_LENGTH, return_tensors="tf")
        return inputs

    def detect_fake_news(self, text: str) -> dict:
        inputs = self.preprocess_text(text)
        outputs = self.model(inputs)
        logits = outputs.logits
        probabilities = tf.nn.softmax(logits, axis=-1)[0].numpy()
        confidence = float(probabilities[1])
        label = "FAKE" if np.argmax(probabilities) == 1 else "REAL"
        suspicious_phrases = self.extract_suspicious_phrases(text)
        return {
            "label": label,
            "confidence": confidence * 100,
            "suspicious_phrases": suspicious_phrases
        }

    def extract_suspicious_phrases(self, text: str) -> list:
        found = []
        for keyword in self.suspicious_keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', text, flags=re.IGNORECASE):
                found.append(keyword)
        return found

    def load_model(self, directory: str):
        self.model = TFBertForSequenceClassification.from_pretrained(directory)
        self.tokenizer = BertTokenizer.from_pretrained(directory)

    def save_model(self, directory: str):
        os.makedirs(directory, exist_ok=True)
        self.model.save_pretrained(directory)
        self.tokenizer.save_pretrained(directory)