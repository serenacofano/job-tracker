import enum

from sqlalchemy import Column, Date, Enum, ForeignKey, Integer, String, Text

from app.database import Base


class InterviewType(enum.Enum):
    behavioural = "behavioural"
    technical = "technical"
    phone_screen = "phone_screen"


class InterviewerRole(enum.Enum):
    hr = "hr"
    technical = "technical"
    manager = "manager"
    ceo = "ceo"


class InterviewOutcome(enum.Enum):
    passed = "passed"
    failed = "failed"
    pending = "pending"


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    type = Column(Enum(InterviewType), nullable=False)
    interviewer_role = Column(Enum(InterviewerRole), nullable=False)
    date = Column(Date, nullable=True)
    questions = Column(Text, nullable=True)
    outcome = Column(Enum(InterviewOutcome), nullable=False)
    feeling = Column(Integer, nullable=True)
