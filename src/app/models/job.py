import enum

from sqlalchemy import ForeignKey, String, Integer, Text, Column, Enum
from app.database import Base

class JobType(enum.Enum):
    junior = 'Junior'
    medior = 'Medior'
    senior = 'Senior'
    internship = 'Internship'
    lead = 'Lead'
    manager = 'Manager'

class JobQualification(enum.Enum):
    not_required = 'Not Required'
    BSc = 'BSc'
    MSc = 'MSc'
    PhD = 'PhD'

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, nullable=False)
    type = Column(Enum(JobType), nullable=False)
    qualification = Column(Enum(JobQualification), nullable=False)
    tech_requirements = Column(Text, nullable=False)
    soft_skills = Column(Text, nullable=False)

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)