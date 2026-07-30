from sqlalchemy.orm import Session
from db.models import Job

def create_job(db: Session, meeting_id: int):
    new_job = Job(
        meeting_id=meeting_id,
        status="pending",
        progress=0
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

def update_job(db: Session, job_id: int, status: str=None, progress: int=None, current_step: str=None, error_message: str=None):
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        return None

    if status is not None:
        job.status = status

    if progress is not None:
        job.progress = progress

    if current_step is not None:
        job.current_step = current_step

    if error_message is not None:
        job.error_message = error_message

    db.commit()
    db.refresh(job)
    return job

def get_job(db: Session, job_id: int):
    return db.query(Job).filter(Job.id == job_id).first()