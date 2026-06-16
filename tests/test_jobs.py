JOB_PAYLOAD = {
    "role": "Software Engineer",
    "type": "Full-time",
    "qualification": "Bachelor",
    "tech_requirements": "Python, FastAPI",
    "soft_skills": "Communication",
    "company_id": 1,
}

COMPANY_PAYLOAD = {
    "name": "Test Company",
    "type": "Test Type",
    "size": "Test Size",
    "location": "Test Location",
    "website": "https://testcompany.com",
    "notes": "Test Notes"
}


def _create_company(client, auth_headers) -> int:
    response = client.post("/companies/", json=COMPANY_PAYLOAD, headers=auth_headers)
    return response.json().get("id")


def test_create_job(client, auth_headers):
    company_id = _create_company(client, auth_headers)
    payload = {**JOB_PAYLOAD, "company_id": company_id}
    response = client.post("/jobs/", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["role"] == "Software Engineer"


def test_list_jobs(client, auth_headers):
    company_id = _create_company(client, auth_headers)
    payload = {**JOB_PAYLOAD, "company_id": company_id}
    client.post("/jobs/", json=payload, headers=auth_headers)
    client.post("/jobs/", json=payload, headers=auth_headers)
    response = client.get("/jobs/", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_list_jobs_unauthenticated(client):
    response = client.get("/jobs/")
    assert response.status_code == 401
