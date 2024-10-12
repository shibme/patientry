from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional

from database import SessionLocal, engine
import models
from models import Patient
from pydantic import BaseModel

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS to allow any origin, method, and header
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic schema for input validation
class PatientCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: str
    address: str

# Pydantic schema for response model
class PatientResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    phone: str
    address: str

    class Config:
        from_attributes = True  # This is the new config key in Pydantic v2

@app.post("/api/patients/", response_model=PatientResponse)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    new_patient = Patient(name=patient.name, email=patient.email, phone=patient.phone, address=patient.address)
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

@app.get("/api/patients/", response_model=List[PatientResponse])
def get_patients(name: Optional[str] = None, db: Session = Depends(get_db)):
    if name:
        return db.query(Patient).filter(Patient.name.contains(name)).all()
    else:
        return db.query(Patient).all()

@app.get("/api/patients/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@app.put("/api/patients/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: int, patient_update: PatientCreate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    patient.name = patient_update.name
    patient.email = patient_update.email
    patient.phone = patient_update.phone
    patient.address = patient_update.address

    db.commit()
    db.refresh(patient)
    return patient

@app.delete("/api/patients/{patient_id}", response_model=PatientResponse)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return patient

# Mount the frontend static files (HTML, CSS, JS)
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")