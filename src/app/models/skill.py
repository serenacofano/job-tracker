import enum

from sqlalchemy import String, Integer, Column, Enum
from app.database import Base

class Category(enum.Enum):
    soft = 'soft'
    tech = 'tech'

class Skill(Base):
    __tablename__="skills"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(Enum(Category), nullable=False)

    