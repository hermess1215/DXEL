from sqlalchemy.orm import Session
from db.models import Meeting, Transcript, Summary

def create_record(db: Session, title: str, segments: list, summary_data: dict):
    new_meeting = Meeting(title=title)
    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)

    text = " ".join([seg["text"] for seg in segments])
    new_transcript = Transcript(
        meeting_id = new_meeting.id,
        raw_text = text
    )
    db.add(new_transcript)

    new_summary = Summary(
        meeting_id = new_meeting.id,
        summary_text=summary_data.get("summary", ""),
        decisions=summary_data.get("decisions", []),
        todos=summary_data.get("todos", []),
        next_agenda=summary_data.get("next_agenda", [])
    )
    db.add(new_summary)

    db.commit()
    db.refresh(new_meeting)

    return new_meeting