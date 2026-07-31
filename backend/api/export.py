import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from db.database import get_db
from db.models import Meeting, Transcript, Summary
from utils.docx_generator import generate_docx
from api.meeting import parse_segments

router = APIRouter()

@router.get("/export/{meeting_id}")
def export_docx(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()

    if meeting is None:
        raise HTTPException(status_code=404)

    transcript = db.query(Transcript).filter(Transcript.meeting_id == meeting_id).first()
    summary = db.query(Summary).filter(Summary.meeting_id == meeting_id).first()

    meeting_data = {
        "title": meeting.title,
        "created_at": str(meeting.created_at),
        "transcript": {
            "segments": parse_segments(transcript.raw_text) if transcript else []
        },
        "summary": {
            "summary_text": summary.summary_text if summary else "",
            "decisions": summary.decisions if summary else [],
            "todos": summary.todos if summary else [],
            "next_agenda": summary.next_agenda if summary else []
        } if summary else None
    }

    output_dir = "outputs/docx"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"meeting_{meeting_id}.docx")

    generate_docx(meeting_data, output_path)

    return FileResponse(
        path=output_path,
        filename=f"{meeting.title}.docx",
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )