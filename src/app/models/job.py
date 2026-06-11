from sqlalchemy import ForeignKey, String, Integer, Text, Column
from app.database import Base

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, nullable=False)
    type = Column(String, nullable=False)
    qualification = Column(String, nullable=False)
    tech_requirements = Column(Text, nullable=False)
    soft_skills = Column(Text, nullable=False)

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)