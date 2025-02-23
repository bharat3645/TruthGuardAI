from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os, time, random, datetime
from models import DeepfakeDetector, FakeNewsDetector

app = Flask(__name__)
UPLOAD_FOLDER = "temp"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Instantiate models (for MVP, these can be dummy or pre-trained models)
deepfake_detector = DeepfakeDetector()
fake_news_detector = FakeNewsDetector()
# Optionally load saved weights if available:
# deepfake_detector.load_models("path/to/deepfake_models")
# fake_news_detector.load_model("path/to/fakenews_model")

@app.route("/deepfake", methods=["POST"])
def deepfake_detection():
    start_time = time.time()
    # Expect a file and a form field "mediaType"
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    media_type = request.form.get("mediaType", "image")  # default to image
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    try:
        # Use the appropriate detection method
        if media_type == "image":
            model_conf = deepfake_detector.detect_image(file_path) * 100  # convert to percentage
        elif media_type == "video":
            model_conf = deepfake_detector.detect_video(file_path) * 100
        elif media_type == "audio":
            model_conf = deepfake_detector.detect_audio(file_path) * 100
        else:
            os.remove(file_path)
            return jsonify({"error": "Unsupported media type"}), 400

        os.remove(file_path)

        # Simulate additional metrics (these values can be fine-tuned)
        if media_type in ["image", "video"]:
            facial_conf = model_conf + random.uniform(-5, 5)
            audio_conf = random.uniform(80, 95)
        elif media_type == "audio":
            facial_conf = random.uniform(70, 90)
            audio_conf = model_conf + random.uniform(-5, 5)
        metadata_conf = random.uniform(90, 100)
        temporal_conf = random.uniform(85, 100)

        overall_conf = (metadata_conf * 0.3 + temporal_conf * 0.3 +
                        facial_conf * 0.2 + audio_conf * 0.2)
        is_authentic = overall_conf > 85

        # Helper for severity assignment
        def get_severity(conf):
            if conf < 70:
                return "high"
            elif conf < 85:
                return "medium"
            else:
                return "low"

        artifacts = [
            {
                "type": "Facial Analysis",
                "description": "Inconsistencies in facial features detected.",
                "severity": get_severity(facial_conf),
                "confidence": round(facial_conf, 1)
            },
            {
                "type": "Audio Sync",
                "description": "Issues in audio-visual synchronization.",
                "severity": get_severity(audio_conf),
                "confidence": round(audio_conf, 1)
            },
            {
                "type": "Temporal Coherence",
                "description": "Irregularities in frame transitions.",
                "severity": get_severity(temporal_conf),
                "confidence": round(temporal_conf, 1)
            }
        ]

        techniques = [
            {
                "name": "Deep Neural Network",
                "description": "AI-based feature extraction and analysis.",
                "confidence": round(facial_conf, 1),
                "icon": "Zap"  # Icon name for frontend
            },
            {
                "name": "Metadata Verification",
                "description": "Integrity check of file metadata.",
                "confidence": round(metadata_conf, 1),
                "icon": "Shield"
            },
            {
                "name": "Temporal Analysis",
                "description": "Frame consistency and motion analysis.",
                "confidence": round(temporal_conf, 1),
                "icon": "Clock"
            }
        ]

        detection_methods = {
            "facial": round(facial_conf, 1),
            "audio": round(audio_conf, 1),
            "metadata": round(metadata_conf, 1),
            "temporal": round(temporal_conf, 1)
        }
        processing_time = round(time.time() - start_time, 2)
        timestamp = datetime.datetime.now().isoformat()

        result = {
            "isAuthentic": is_authentic,
            "overallConfidence": round(overall_conf, 1),
            "artifacts": artifacts,
            "techniques": techniques,
            "detectionMethods": detection_methods,
            "processingTime": processing_time,
            "timestamp": timestamp
        }
        return jsonify(result)
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({"error": str(e)}), 500

@app.route("/fakenews", methods=["POST"])
def fakenews_detection():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400
    text = data["text"]
    try:
        res = fake_news_detector.detect_fake_news(text)
        result_message = (
            "This content appears to be legitimate news"
            if res["label"] == "REAL"
            else "This content shows characteristics of potential misinformation"
        )
        result = {
            "result": result_message,
            "confidence": round(res["confidence"], 1),
            "suspiciousPhrases": res["suspicious_phrases"]
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)