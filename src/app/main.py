from fastapi import FastAPI
from app.routers import company, job, application, interview, auth

app = FastAPI(title="Job Tracker")
app.include_router(company.router)
app.include_router(job.router)
app.include_router(application.router)
app.include_router(interview.router)
app.include_router(auth.router)