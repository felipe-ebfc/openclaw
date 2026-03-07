#!/usr/bin/env python3
"""
EBFC AI Voice API — HTTP wrapper for TTS + STT
Runs inside Docker container alongside OpenClaw.

Endpoints:
  POST /tts  {"text": "Hello"} -> audio/mpeg
  POST /stt  (multipart audio file) -> {"text": "transcription"}
  GET  /health -> {"status": "ok", "tts": true, "stt": true}
"""

import os
import subprocess
import tempfile
from pathlib import Path
from flask import Flask, request, jsonify, send_file

app = Flask(__name__)

# Model paths (mounted volumes)
KOKORO_MODEL = Path("/models/kokoro/kokoro-v1.0.onnx")
KOKORO_VOICES = Path("/models/kokoro/voices-v1.0.bin")
WHISPER_MODEL = Path("/models/whisper/ggml-small.bin")
OUTPUT_DIR = Path("/app/output")

def check_models():
    """Check which models are available."""
    return {
        "tts": KOKORO_MODEL.exists() and KOKORO_VOICES.exists(),
        "stt": WHISPER_MODEL.exists(),
    }

@app.route("/health", methods=["GET"])
def health():
    models = check_models()
    return jsonify({"status": "ok", **models})

@app.route("/tts", methods=["POST"])
def tts():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400

    text = data["text"]
    voice = data.get("voice", "af_heart")
    speed = data.get("speed", 1.3)

    try:
        from speak import speak
        output_path = speak(text)
        return send_file(output_path, mimetype="audio/mpeg")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/stt", methods=["POST"])
def stt():
    if "audio" not in request.files:
        return jsonify({"error": "Missing 'audio' file"}), 400

    audio_file = request.files["audio"]

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp_path = tmp.name
        audio_file.save(tmp_path)

    try:
        # Convert to whisper-compatible format
        wav_path = tmp_path + ".16k.wav"
        subprocess.run([
            "ffmpeg", "-y", "-i", tmp_path,
            "-ar", "16000", "-ac", "1", wav_path
        ], capture_output=True)

        # Run whisper
        # Note: whisper-cli must be available in PATH or installed in container
        result = subprocess.run([
            "whisper-cli",
            "-m", str(WHISPER_MODEL),
            "-f", wav_path,
            "--no-timestamps",
            "-l", "auto"
        ], capture_output=True, text=True)

        transcription = result.stdout.strip()

        return jsonify({"text": transcription})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        for f in [tmp_path, tmp_path + ".16k.wav"]:
            if os.path.exists(f):
                os.remove(f)

if __name__ == "__main__":
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    port = int(os.environ.get("VOICE_PORT", 8090))
    print(f"EBFC AI Voice API starting on port {port}")
    models = check_models()
    print(f"  TTS (Kokoro): {'OK' if models['tts'] else 'MISSING - models not mounted'}")
    print(f"  STT (Whisper): {'OK' if models['stt'] else 'MISSING - model not mounted'}")
    app.run(host="0.0.0.0", port=port)
