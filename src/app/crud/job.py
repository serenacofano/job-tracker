from app.models.job import Job
from app.models.skill import Skill
from app.schemas.job import JobCreate, JobUpdate
from sqlalchemy.orm import Session

def get_job(db: Session, job_id: int) -> Job | None:
    return db.query(Job).filter(Job.id == job_id).first()

def get_jobs(db: Session, skip=0, limit=100) -> list[Job]:
    return db.query(Job).offset(skip).limit(limit).all()

def create_job(db: Session, data: JobCreate) -> Job:
    skill_ids = data.skill_ids
    db_obj = Job(**data.model_dump(exclude={'skill_ids'}))
    db_obj.skills = db.query(Skill).filter(Skill.id.in_(skill_ids)).all()
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_job(db: Session, db_obj: Job, data: JobUpdate) -> Job:
    for field, value in data.model_dump(exclude_unset=True, exclude={'skill_ids'}).items():
        setattr(db_obj, field, value)
    if data.skill_ids is not None:
        db_obj.skills = db.query(Skill).filter(Skill.id.in_(data.skill_ids)).all()
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_job(db: Session, db_obj: Job) -> None:
    db.delete(db_obj)
    db.commit()
