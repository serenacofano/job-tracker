COMPANY_PAYLOAD = {
    "name": "Test Company",
    "type": "Tech",
    "size": "Large",
    "location": "Rome",
}

JOB_PAYLOAD = {
    "role": "Software Engineer",
    "type": "Full-time",
    "qualification": "Bachelor",
    "tech_requirements": "Python",
    "soft_skills": "Communication",
    "company_id": 1,
}

APPLICATION_PAYLOAD = {
    "job_id": 1,
    "status": "applied",
    "date_applied": "2026-01-01",
}

INTERVIEW_PAYLOAD = {
    "application_id": 1,
    "type": "technical",
    "interviewer_role": "hr",
    "date": "2026-02-01",
    "outcome": "pending",
    "feeling": 3,
}


def _create_interview(client, auth_headers) -> int:
    company_id = client.post("/companies/", json=COMPANY_PAYLOAD, headers=auth_headers).json()["id"]
    job_id = client.post("/jobs/", json={**JOB_PAYLOAD, "company_id": company_id}, headers=auth_headers).json()["id"]
    app_id = client.post("/applications/", json={**APPLICATION_PAYLOAD, "job_id": job_id}, headers=auth_headers).json()["id"]
    response = client.post("/interviews/", json={**INTERVIEW_PAYLOAD, "application_id": app_id}, headers=auth_headers)
    return response.json()["id"]


def test_create_interview(client, auth_headers):
    _create_interview(client, auth_headers)
    response = client.get("/interviews/", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["type"] == "technical"


def test_list_interviews_unauthenticated(client):
    response = client.get("/interviews/")
    assert response.status_code == 401


def test_interview_feeling_validation(client, auth_headers):
    company_id = client.post("/companies/", json=COMPANY_PAYLOAD, headers=auth_headers).json()["id"]
    job_id = client.post("/jobs/", json={**JOB_PAYLOAD, "company_id": company_id}, headers=auth_headers).json()["id"]
    app_id = client.post("/applications/", json={**APPLICATION_PAYLOAD, "job_id": job_id}, headers=auth_headers).json()["id"]
    payload = {**INTERVIEW_PAYLOAD, "application_id": app_id, "feeling": 10}
    response = client.post("/interviews/", json=payload, headers=auth_headers)
    assert response.status_code == 422
