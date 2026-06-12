from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.crud.interview import create_interview, delete_interview, get_interviews, get_interview, update_interview
from app.database import get_db
from app.schemas.interview import InterviewCreate, InterviewResponse, InterviewUpdate

router = APIRouter(prefix="/interviews", tags=["interviews"])

@router.get("/", response_model=list[InterviewResponse])
def list_interviews(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_interviews(db, skip=skip, limit=limit)   

@router.get("/{interview_id}", response_model=InterviewResponse)
def read_interview(interview_id: int, db: Session = Depends(get_db)):
    interview = get_interview(db, interview_id)
    if interview is None:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview

@router.post("/", response_model=InterviewResponse, status_code=201)
def create(data: InterviewCreate, db: Session = Depends(get_db)):
    return create_interview(db, data)   

@router.put("/{interview_id}", response_model=InterviewResponse)
def update(interview_id: int, data: InterviewUpdate, db: Session = Depends(get_db)):
    interview = get_interview(db, interview_id)
    if interview is None:
        raise HTTPException(status_code=404, detail="Interview not found")
    return update_interview(db, interview, data)

@router.delete("/{interview_id}", status_code=204)
def delete(interview_id: int, db: Session = Depends(get_db)):
    interview = get_interview(db, interview_id)
    if interview is None:
        raise HTTPException(status_code=404, detail="Interview not found")
    delete_interview(db, interview)