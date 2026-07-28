from faster_whisper import WhisperModel

_model = None

def load_model():
    global _model
    if _model is None:
        _model = WhisperModel(
            "../models/faster-whisper-medium",
            device="cpu",
            compute_type="int8"
        )
    return _model

def audio_transcription(file_path:str):
    model = load_model()

    segments, info = model.transcribe(
        file_path,
        language="ko",
        vad_filter=True,
        beam_size=5
    )

    result = []
    for segment in segments:
        result.append({
            "start": round(segment.start, 2),
            "end": round(segment.end, 2),
            "text": segment.text.strip()
        })

    return result