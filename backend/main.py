from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import Base, engine
from db import models

from api.upload import router as upload_router
from api.job import router as job_router
from api.meeting import router as meeting_router
from api.export import router as export_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(job_router)
app.include_router(meeting_router)
app.include_router(export_router)

@app.get("/")
def read_root():
    return {"message": "DXEL backend running"}