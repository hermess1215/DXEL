import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from db.models import Meeting, Summary, Transcript, Job

router = APIRouter()

@router.get("/meetings")
def get_meeting_list(db: Session = Depends(get_db)):
    meetings = db.query(Meeting).order_by(Meeting.created_at.desc()).all()

    result = []

    for meeting in meetings:
        latest = (
            db.query(Job).filter(Job.meeting_id == meeting.id).order_by(Job.created_at.desc()).first()
        )

        result.append({
            "id": meeting.id,
            "title": meeting.title,
            "created_at": meeting.created_at,
            "status": latest.status if latest else "unknown",
            "progress": latest.progress if latest else 0
        })
        
    return result

@router.get("/meetings/{meeting_id}")
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()

    if meeting is None:
        raise HTTPException(status_code=404)

    transcript = db.query(Transcript).filter(Transcript.meeting_id == meeting_id).first()
    summary = db.query(Summary).filter(Summary.meeting_id == meeting_id).first()

    return {
        "id": meeting.id,
        "title": meeting.title,
        "created_at": meeting.created_at,
        "transcript": {
            "segments": parse_segments(transcript.raw_text) if transcript else []
        },
        "summary": {
            "summary_text": summary.summary_text if summary else None,
            "decisions": summary.decisions if summary else None,
            "todos": summary.todos if summary else None,
            "next_agenda": summary.next_agenda if summary else None
        } if summary else None
    }

def parse_segments(raw_text: str):
    pattern = r"\[(\d+\.?\d*)s\]\s*(.+)"
    lines = raw_text.split("\n")

    segments = []
    for line in lines:
        match = re.match(pattern, line)
        if match:
            start_time = float(match.group(1))
            text = match.group(2).strip()
            segments.append({
                "start": start_time,
                "text": text
            })

    return segments