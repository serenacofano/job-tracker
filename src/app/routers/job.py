from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.crud.job import create_job, delete_job, get_jobs, get_job, update_job
from app.database import get_db
from app.schemas.job import JobCreate, JobResponse, JobUpdate

from app.routers.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.get("/", response_model=list[JobResponse])
def list_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_jobs(db, skip=skip, limit=limit) 

@router.get("/{job_id}", response_model=JobResponse)
def read_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = get_job(db, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job  

@router.post("/", response_model=JobResponse, status_code=201)
def create(data: JobCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_job(db, data) 

@router.put("/{job_id}", response_model=JobResponse)
def update(job_id: int, data: JobUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = get_job(db, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return update_job(db, job, data)

@router.delete("/{job_id}", status_code=204)
def delete(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = get_job(db, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    try:
        delete_job(db, job)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cannot delete this job because it has linked applications. Delete them first.")