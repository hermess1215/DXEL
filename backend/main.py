from fastapi import FastAPI
from db.database import Base, engine
from db import models

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "DXEL backend running"}