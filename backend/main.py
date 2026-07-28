from fastapi import FastAPI
from db.database import Base, engine
from db import models

from api.upload import router as upload_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(upload_router)

@app.get("/")
def read_root():
    return {"message": "DXEL backend running"}