from fastapi import FastAPI
from app.routers import company, job, application, interview, auth, skill
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Job Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(company.router)
app.include_router(job.router)
app.include_router(application.router)
app.include_router(interview.router)
app.include_router(auth.router)
app.include_router(skill.router)