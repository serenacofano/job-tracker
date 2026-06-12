from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationUpdate    
from sqlalchemy.orm import Session  

def get_application(db: Session, application_id: int) -> Application | None:
    return db.query(Application).filter(Application.id == application_id).first()

def get_applications(db: Session, skip=0, limit=100) -> list[Application]:  
    return db.query(Application).offset(skip).limit(limit).all()

def create_application(db: Session, data: ApplicationCreate) -> Application:
    db_obj = Application(**data.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_application(db: Session, db_obj: Application, data: ApplicationUpdate) -> Application:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_application(db: Session, db_obj: Application) -> None:
    db.delete(db_obj)
    db.commit()
    