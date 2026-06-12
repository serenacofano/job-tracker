from app.models.interview import Interview
from app.schemas.interview import InterviewCreate, InterviewUpdate
from sqlalchemy.orm import Session

def get_interview(db: Session, interview_id: int) -> Interview | None:
    return db.query(Interview).filter(Interview.id == interview_id).first()

def get_interviews(db: Session, skip=0, limit=100) -> list[Interview]:
    return db.query(Interview).offset(skip).limit(limit).all()

def create_interview(db: Session, data: InterviewCreate) -> Interview:
    db_obj = Interview(**data.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_interview(db: Session, db_obj: Interview, data: InterviewUpdate) -> Interview:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_interview(db: Session, db_obj: Interview) -> None:
    db.delete(db_obj)
    db.commit()