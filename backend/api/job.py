from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from services.job_service import get_job

router = APIRouter()

@router.get("/jobs/{job_id}")
def job_status(job_id: int, db: Session = Depends(get_db)):
    job = get_job(db, job_id)

    if job is None:
        raise HTTPException(status_code=404)

    return {
        "job_id": job.id,
        "meeting_id": job.meeting_id,
        "status": job.status,
        "progress": job.progress,
        "current_step": job.current_step,
        "error_message": job.error_message
    }