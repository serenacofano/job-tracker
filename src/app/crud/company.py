from app.models.company import Company
from app.schemas.company import CompanyCreate, CompanyUpdate
from sqlalchemy.orm import Session


def get_company(db: Session, company_id: int) -> Company | None:
    return db.query(Company).filter(Company.id == company_id).first()

def get_companies(db: Session, skip=0, limit=100) -> list[Company]:
    return db.query(Company).offset(skip).limit(limit).all()

def create_company(db: Session, data: CompanyCreate) -> Company:
    db_obj = Company(**data.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_company(db: Session, db_obj: Company, data: CompanyUpdate) -> Company:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_company(db: Session, db_obj: Company) -> None:
    db.delete(db_obj)
    db.commit()