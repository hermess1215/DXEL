from faster_whisper import WhisperModel

_model = None

def load_model():
    global _model
    if _model is None:
        _model = WhisperModel(
            "../models/faster-whisper-large-v2",
            device="cpu",
            compute_type="float32"
        )
    return _model

def audio_transcription(file_path:str):
    model = load_model()

    segments, info = model.transcribe(
        file_path,
        language="ko",
        vad_filter=True,
        beam_size=20,
        vad_parameters=dict(threshold=0.257),
        initial_prompt="이것은 회의 녹음입니다. 정확한 맞춤법과 띄어쓰기로 전사해주세요. 날짜 표현을 정확하게 인식해주세요."
    )

    result = []
    for segment in segments:
        result.append({
            "start": round(segment.start, 2),
            "end": round(segment.end, 2),
            "text": segment.text.strip()
        })

    return result, round(info.duration)