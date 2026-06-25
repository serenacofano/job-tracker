from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.crud.company import create_company, delete_company, get_companies, get_company, update_company
from app.database import get_db
from app.schemas.company import CompanyCreate, CompanyResponse, CompanyUpdate
from app.routers.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/companies", tags=["companies"])



@router.get("/", response_model=list[CompanyResponse])
def list_companies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_companies(db, skip=skip, limit=limit)


@router.get("/{company_id}", response_model=CompanyResponse)
def read_company(company_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    company = get_company(db, company_id)
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@router.post("/", response_model=CompanyResponse, status_code=201)
def create(data: CompanyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_company(db, data)


@router.put("/{company_id}", response_model=CompanyResponse)
def update(company_id: int, data: CompanyUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    company = get_company(db, company_id)
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return update_company(db, company, data)

@router.delete("/{company_id}", status_code=204)
def delete(company_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    company = get_company(db, company_id)
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    try:
        delete_company(db, company)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cannot delete this company because it has linked jobs. Delete them first.")
