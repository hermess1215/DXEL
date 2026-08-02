from sqlalchemy.orm import Session
from db.models import Meeting, Transcript, Summary

def create_meeting(db: Session, title: str):
    new_meeting = Meeting(title=title)
    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)
    return new_meeting

def save(db: Session, meeting_id: int, segments: list, summary_data: dict, cleaned_text = None):
    text = "\n".join([f"[{seg['start']}s] {seg['text']}" for seg in segments])
    new_transcript = Transcript(
        meeting_id = meeting_id,
        raw_text = text,
        cleaned_text = cleaned_text
    )
    db.add(new_transcript)

    new_summary = Summary(
        meeting_id = meeting_id,
        summary_text = summary_data.get("summary", ""),
        decisions = summary_data.get("decisions", []),
        todos = summary_data.get("todos", []),
        next_agenda = summary_data.get("next_agenda", [])
    )
    db.add(new_summary)
    
    db.commit()

def update_duration(db: Session, meeting_id: int, duration: int):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()

    if meeting:
        meeting.duration = duration
        db.commit()