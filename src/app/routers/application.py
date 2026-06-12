from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.crud.application import create_application, delete_application, get_applications, get_application, update_application
from app.database import get_db
from app.schemas.application import ApplicationCreate, ApplicationResponse, ApplicationUpdate

router = APIRouter(prefix="/applications", tags=["applications"])

@router.get("/", response_model=list[ApplicationResponse])
def list_applications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_applications(db, skip=skip, limit=limit)

@router.get("/{application_id}", response_model=ApplicationResponse)
def read_application(application_id: int, db: Session = Depends(get_db)):
    application = get_application(db, application_id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return application

@router.post("/", response_model=ApplicationResponse, status_code=201)
def create(data: ApplicationCreate, db: Session = Depends(get_db)):
    return create_application(db, data) 

@router.put("/{application_id}", response_model=ApplicationResponse)
def update(application_id: int, data: ApplicationUpdate, db: Session = Depends(get_db)):
    application = get_application(db, application_id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return update_application(db, application, data)

@router.delete("/{application_id}", status_code=204)
def delete(application_id: int, db: Session = Depends(get_db)):
    application = get_application(db, application_id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    delete_application(db, application)