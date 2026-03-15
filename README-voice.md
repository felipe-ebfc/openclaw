# EBFC AI Voice Pipeline

Kokoro TTS (text-to-speech) + Whisper STT (speech-to-text) running as a sidecar container alongside `openclaw-gateway`.

- **TTS:** Kokoro ONNX (`af_heart` voice, 1.3x speed) — local, no cloud API
- **STT:** whisper.cpp (`ggml-small` model, auto language detection)
- **API:** Flask on port 8090, reachable inside the compose network as `http://voice:8090`

---

## Model Download

Models are mounted as volumes — they are **not** baked into the image. Download them once and point the env vars at the host directories.

### Kokoro (~337MB total)

```bash
mkdir -p ./models/kokoro
curl -L -o ./models/kokoro/kokoro-v1.0.onnx \
  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -L -o ./models/kokoro/voices-v1.0.bin \
  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
```

### Whisper small (~465MB)

```bash
mkdir -p ./models/whisper
curl -L -o ./models/whisper/ggml-small.bin \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `KOKORO_MODELS_DIR` | `./models/kokoro` | Host path containing `kokoro-v1.0.onnx` and `voices-v1.0.bin` |
| `WHISPER_MODELS_DIR` | `./models/whisper` | Host path containing `ggml-small.bin` |
| `VOICE_PORT` | `8090` | Host port mapped to the voice container |

Set these in a `.env` file or export them before running `docker compose up`.

---

## Running

### Full stack (gateway + ollama + voice)

```bash
docker compose up
```

### Voice service only

```bash
docker compose up voice
```

### Build the voice image

```bash
docker compose build voice
```

---

## API Endpoints

### `GET /health`

Returns model availability.

```bash
curl http://localhost:8090/health
# {"status": "ok", "tts": true, "stt": true}
```

### `POST /tts`

Convert text to speech. Returns `audio/mpeg`.

```bash
curl -X POST http://localhost:8090/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, this is EBFC AI speaking."}' \
  --output response.mp3

# Optional parameters:
# "voice": "af_heart"  (default)
# "speed": 1.3         (default)
```

### `POST /stt`

Transcribe audio to text. Accepts any format ffmpeg can read (WAV, MP3, M4A, etc.).

```bash
curl -X POST http://localhost:8090/stt \
  -F "audio=@recording.wav"
# {"text": "Hello this is EBFC AI speaking"}
```

---

## Whisper CLI Note

The Dockerfile installs Python deps but does **not** bundle `whisper-cli`. For STT to work, `whisper-cli` must be available in the container's `PATH`. Options:

1. Build whisper.cpp from source in the Dockerfile (add `cmake`, `build-essential`, clone + compile)
2. Copy a pre-built `whisper-cli` binary into the image at build time
3. Install via a package if your base distro ships it

TTS works out of the box via `kokoro-onnx` (pure Python + ONNX runtime).

---

## Voice from openclaw-gateway

Inside the compose network, the gateway can reach the voice service at:

```
http://voice:8090/tts
http://voice:8090/stt
http://voice:8090/health
```

No additional networking config required — both services share the default compose bridge network.
