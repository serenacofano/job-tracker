def test_create_company(client, auth_headers):
    response = client.post("/companies/", json={"name": "Test Company", "type": "Test Type", "size": "Test Size", "location": "Test Location", "website": "https://testcompany.com", "notes": "Test Notes"}, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["name"] == "Test Company"
    assert response.json()["type"] == "Test Type"
    assert response.json()["size"] == "Test Size"
    assert response.json()["location"] == "Test Location"
    assert response.json()["website"] == "https://testcompany.com"
    assert response.json()["notes"] == "Test Notes"

def test_list_companies(client, auth_headers):
    client.post("/companies/", json={"name": "Test Company 1", "type": "Type 1", "size": "Size 1", "location": "Location 1"}, headers=auth_headers)
    client.post("/companies/", json={"name": "Test Company 2", "type": "Type 2", "size": "Size 2", "location": "Location 2"}, headers=auth_headers)
    response = client.get("/companies/", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 2

def test_list_companies_unauthenticated(client):
    response = client.get("/companies/")
    assert response.status_code == 401