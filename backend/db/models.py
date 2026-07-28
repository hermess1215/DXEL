from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from datetime import datetime, timezone
from .database import Base

def utcnow():
    return datetime.now(timezone.utc)

class Meeting(Base):
    __tablename__ = "meeting"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    participants = Column(String)
    meeting_date = Column(DateTime)
    created_at = Column(DateTime, default=utcnow)

class Transcript(Base):
    __tablename__ = "transcript"

    id = Column(Integer, primary_key=True)
    meeting_id = Column(Integer, ForeignKey("meeting.id"))
    raw_text = Column(Text)
    cleaned_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)

class Summary(Base):
    __tablename__ = "summary"
    
    id = Column(Integer, primary_key=True)
    meeting_id = Column(Integer, ForeignKey("meeting.id"), unique=True)
    summary_text = Column(Text)
    decisions = Column(JSON)
    todos = Column(JSON)
    next_agenda = Column(JSON)
    created_at = Column(DateTime, default=utcnow)

class Job(Base):
    __tablename__ = "job"

    id = Column(Integer, primary_key=True)
    meeting_id = Column(Integer, ForeignKey("meeting.id"))
    status = Column(String)
    progress = Column(Integer)
    current_step = Column(String, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)