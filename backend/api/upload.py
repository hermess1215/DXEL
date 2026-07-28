from fastapi import APIRouter, UploadFile, File, Depends
import shutil
import os
from sqlalchemy.orm import Session

from ai.whisper_model import audio_transcription
from services.summary_service import extract
from services.meeting_service import create_record
from db.database import get_db

router = APIRouter()

@router.post("/upload")
async def upload_record(file: UploadFile = File(...), db: Session = Depends(get_db)):
    save_dir = "uploads/audio"
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, file.filename)

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    segments = audio_transcription(save_path)
    full_text = " ".join([seg["text"] for seg in segments])
    result = extract(full_text)

    meeting = create_record(
        db=db,
        title=file.filename,
        segments=segments,
        summary_data=result
    )

    return{
        "meeting_id": meeting.id,
        "filename": file.filename,
        "segments": segments,
        "summary": result
    }