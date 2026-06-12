import enum

from sqlalchemy import Column, Date, Enum, ForeignKey, Integer, String

from app.database import Base


class ApplicationStatus(enum.Enum):
    applied = "applied"
    in_progress = "in_progress"
    rejected = "rejected"
    offer_received = "offer_received"
    accepted = "accepted"
    withdrawn = "withdrawn"


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    status = Column(Enum(ApplicationStatus), nullable=False)
    date_applied = Column(Date, nullable=False)
    cv_url = Column(String, nullable=True)
    cover_letter_url = Column(String, nullable=True)
