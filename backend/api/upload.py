from fastapi import APIRouter, UploadFile, File, Depends, BackgroundTasks
import shutil
import os
from sqlalchemy.orm import Session

from ai.whisper_model import audio_transcription
from services.summary_service import extract, clean_transcript
from services.meeting_service import create_meeting, save, update_duration
from services.job_service import create_job, update_job
from utils.audio import calculate_hash
from db.models import Meeting
from db.database import get_db, SessionLocal

router = APIRouter()

@router.post("/upload")
async def upload_meeting(background_tasks: BackgroundTasks, file: UploadFile = File(...), force: bool = False, db: Session = Depends(get_db)):
    save_dir = "uploads/audio"
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, file.filename)

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_hash = calculate_hash(save_path)

    if not force:
        existing = db.query(Meeting).filter(Meeting.file_hash == file_hash).first()

        if existing:
            return {
                "duplicate": True,
                "existing_meeting_id": existing.id,
                "existing": existing.title
            }

    meeting = create_meeting(db, title=file.filename)
    meeting.file_hash = file_hash
    db.commit()

    job = create_job(db, meeting_id=meeting.id)

    background_tasks.add_task(process_meeting, job.id, meeting.id, save_path)

    return {
        "job_id": job.id,
        "meeting_id": meeting.id,
        "status": "pending",
        "duplicate": False
    }

def process_meeting(job_id: int, meeting_id: int, file_path: str):
    db = SessionLocal()

    try:
        update_job(db, job_id, status="processing", current_step="transcribing", progress=10)

        segments, duration = audio_transcription(file_path)
        update_duration(db, meeting_id, duration)
        full_text = " ".join([seg["text"] for seg in segments])

        update_job(db, job_id, current_step="cleaning", progress=40)
        cleaned_text = clean_transcript(full_text)

        update_job(db, job_id, current_step="summarizing", progress=60)
        summary_result = extract(full_text)

        update_job(db, job_id, current_step="saving", progress=90)
        save(db, meeting_id, segments, summary_result, cleaned_text)

        update_job(db, job_id, status="done", current_step="completed", progress=100)

    except Exception as e:
        update_job(db, job_id, status="failed", error_message=str(e))

    finally:
        db.close()