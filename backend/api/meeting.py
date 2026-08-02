import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from db.database import get_db
from db.models import Meeting, Summary, Transcript, Job

router = APIRouter()

class ParticipantsUpdate(BaseModel):
    participants: str

@router.get("/meetings")
def get_meeting_list(keyword: str=None, search_type: str="title", db: Session = Depends(get_db)):
    query = db.query(Meeting)

    if keyword and search_type == "title":
        query = query.filter(Meeting.title.contains(keyword))

    meetings = query.order_by(Meeting.created_at.desc()).all()

    result = []

    for meeting in meetings:
        latest = (
            db.query(Job).filter(Job.meeting_id == meeting.id).order_by(Job.created_at.desc()).first()
        )

        transcript_snippet = None

        if keyword and search_type == "transcript":
            transcript = db.query(Transcript).filter(Transcript.meeting_id == meeting.id).first()

            if transcript and keyword in transcript.raw_text:
                transcript_snippet = extract_snippet(transcript.raw_text, keyword)
            else:
                continue

        attendee_count = len([p for p in (meeting.participants or "").split(",") if p.strip()])

        result.append({
            "id": meeting.id,
            "title": meeting.title,
            "created_at": meeting.created_at.isoformat() + "Z" if meeting.created_at else None,
            "duration": meeting.duration,
            "attendee_count": attendee_count,
            "status": latest.status if latest else "unknown",
            "progress": latest.progress if latest else 0,
            "snippet": transcript_snippet
        })
        
    return result

def extract_snippet(text: str, keyword: str, context_chars: int=30):
    index = text.find(keyword)

    if index == -1:
        return None

    start = max(0, index - context_chars)
    end = min(len(text), index + len(keyword) + context_chars)

    return {
        "before": text[start:index],
        "keyword": keyword,
        "after": text[index + len(keyword):end]
    }

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
        "participants": meeting.participants,
        "created_at": meeting.created_at.isoformat() + "Z" if meeting.created_at else None,
        "transcript": {
            "segments": parse_segments(transcript.raw_text) if transcript else [],
            "cleaned_text": transcript.cleaned_text if transcript else None
        },
        "summary": {
            "summary_text": summary.summary_text if summary else None,
            "decisions": summary.decisions if summary else None,
            "todos": summary.todos if summary else None,
            "next_agenda": summary.next_agenda if summary else None
        } if summary else None
    }

@router.patch("/meetings/{meeting_id}/participants")
def update_participants(meeting_id: int, body: ParticipantsUpdate, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()

    if meeting is None:
        raise HTTPException(status_code=404)

    meeting.participants = body.participants
    db.commit()
    db.refresh(meeting)

    return {
        "id": meeting.id,
        "participants": meeting.participants
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