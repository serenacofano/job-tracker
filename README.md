# Job Application Tracker

A full-stack REST API for tracking job applications.

## Tech Stack

**Backend**
- Python 3.13, FastAPI, SQLAlchemy 2, Alembic
- PostgreSQL, bcrypt, PyJWT

**Frontend**
- React 19, TypeScript, Vite, Tailwind CSS v4
- React Query, React Router v7, Axios

## Features

- JWT authentication (register, login, protected routes)
- Manage companies, jobs, applications, and interviews
- Track application status through the full hiring pipeline
- Record interview details: type, outcome, interviewer role, feeling score
- Secrets scanning with Gitleaks on every push

## Getting Started

### Prerequisites

- Python 3.13+, [uv](https://docs.astral.sh/uv/)
- Node.js 18+
- Docker

### 1. Clone the repository

```bash
git clone <repo-url>
cd job-tracker
```

### 2. Configure environment variables

Create a `.env` file in the project root with the following variables:
`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_HOST`, `POSTGRES_PORT`, `JWT_SECRET_KEY`

### 3. Start the database

```bash
docker compose up -d
```

### 4. Run database migrations

```bash
PYTHONPATH=src uv run alembic upgrade head
```

### 5. Start the backend

```bash
PYTHONPATH=src uv run uvicorn app.main:app --reload
```

API available at `http://localhost:8000` — interactive docs at `http://localhost:8000/docs`

### 6. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend available at `http://localhost:5173`

## Running Tests

Requires a `jobtracker_test` database on the same PostgreSQL instance.

```bash
PYTHONPATH=src uv run pytest
```

## Project Structure

```
src/app/
├── models/       # SQLAlchemy ORM models
├── schemas/      # Pydantic request/response schemas
├── crud/         # Database operations
├── services/     # Business logic (auth, hashing)
├── routers/      # FastAPI route handlers
└── main.py

frontend/src/
├── api/          # Axios API functions
├── pages/        # React page components
├── components/   # Shared components
└── types/        # TypeScript interfaces
```
