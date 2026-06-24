import enum

from sqlalchemy import ForeignKey, String, Integer, Table, Column, Enum
from sqlalchemy.orm import relationship
from app.database import Base

class JobType(enum.Enum):
    junior = 'junior'
    medior = 'medior'
    senior = 'senior'
    internship = 'internship'
    lead = 'lead'
    manager = 'manager'

class JobQualification(enum.Enum):
    not_required = 'not_required'
    BSc = 'BSc'
    MSc = 'MSc'
    PhD = 'PhD'

job_skills = Table(
        "job_skills",
        Base.metadata,
        Column("job_id", Integer, ForeignKey("jobs.id")),
        Column("skill_id", Integer, ForeignKey("skills.id")),
    )

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, nullable=False)
    type = Column(Enum(JobType), nullable=False)
    qualification = Column(Enum(JobQualification), nullable=False)
    skills = relationship("Skill", secondary=job_skills, lazy="selectin")
    

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)