#!/usr/bin/env python3
"""
EBFC AI Voice — TTS via Kokoro (containerized version)
Based on Osito's speak.py, adapted for Docker deployment.
Voice: af_heart (American female, warm) @ 1.3x speed
"""

import subprocess
import sys
import os
import re
from pathlib import Path

# Voice configuration
VOICE = "af_heart"
SPEED = 1.3

# Container paths (models mounted as volumes)
MODEL_PATH = Path("/models/kokoro/kokoro-v1.0.onnx")
VOICES_PATH = Path("/models/kokoro/voices-v1.0.bin")
OUTPUT_DIR = Path("/app/output")

# Spanish detection (conservative)
SPANISH_PATTERNS = [
    r'\b(hola|gracias|por favor|buenos días|buenas noches|buenas tardes|cómo estás|qué tal)\b',
    r'\b(también|después|además|todavía|siempre|nunca|ahora)\b',
    r'\b(tengo|tienes|tiene|tenemos|tienen)\b',
    r'\b(estoy|estás|está|estamos|están)\b',
    r'[¿¡]',
]

def detect_spanish(text: str) -> bool:
    text_lower = text.lower()
    for pattern in SPANISH_PATTERNS:
        if re.search(pattern, text_lower):
            return True
    return False

def speak(text: str, output: str | None = None) -> str:
    """Generate speech from text, return output file path."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if output is None:
        output = str(OUTPUT_DIR / "tts-output.mp3")

    is_spanish = detect_spanish(text)
    voice = "ef_dora" if is_spanish else VOICE  # Spanish voice fallback

    try:
        from kokoro_onnx import Kokoro
        import soundfile as sf
        import numpy as np

        kokoro = Kokoro(str(MODEL_PATH), str(VOICES_PATH))
        samples, sample_rate = kokoro.create(
            text,
            voice=voice,
            speed=SPEED,
            lang="es" if is_spanish else "en-us"
        )

        # Save as WAV first, then convert to MP3 via ffmpeg
        wav_path = output.replace('.mp3', '.wav')
        sf.write(wav_path, samples, sample_rate)

        subprocess.run([
            'ffmpeg', '-y', '-i', wav_path,
            '-codec:a', 'libmp3lame', '-qscale:a', '2',
            output
        ], capture_output=True)

        # Clean up WAV
        if os.path.exists(wav_path) and os.path.exists(output):
            os.remove(wav_path)

        return output

    except Exception as e:
        print(f"TTS Error: {e}", file=sys.stderr)
        raise

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: speak.py <text> [--output path]")
        sys.exit(1)

    text = sys.argv[1]
    output = None
    if "--output" in sys.argv:
        idx = sys.argv.index("--output")
        output = sys.argv[idx + 1]

    result = speak(text, output)
    print(result)
