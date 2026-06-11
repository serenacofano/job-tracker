from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    size = Column(String, nullable=False)
    location = Column(String, nullable=False)
    website = Column(String, nullable=True)
    notes = Column(Text, nullable=True)