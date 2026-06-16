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


def _create_application(client, auth_headers) -> int:
    company_id = client.post("/companies/", json=COMPANY_PAYLOAD, headers=auth_headers).json()["id"]
    job_id = client.post("/jobs/", json={**JOB_PAYLOAD, "company_id": company_id}, headers=auth_headers).json()["id"]
    response = client.post("/applications/", json={**APPLICATION_PAYLOAD, "job_id": job_id}, headers=auth_headers)
    return response.json()["id"]


def test_create_application(client, auth_headers):
    _create_application(client, auth_headers)
    response = client.get("/applications/", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["status"] == "applied"


def test_list_applications_unauthenticated(client):
    response = client.get("/applications/")
    assert response.status_code == 401


def test_delete_application(client, auth_headers):
    app_id = _create_application(client, auth_headers)
    response = client.delete(f"/applications/{app_id}", headers=auth_headers)
    assert response.status_code == 204
    response = client.get("/applications/", headers=auth_headers)
    assert len(response.json()) == 0
