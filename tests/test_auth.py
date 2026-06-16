def test_register(client):
    response = client.post("/auth/register", json={"email": "a@test.com", "password": "secret123"})
    assert response.status_code == 201
    assert response.json()["email"] == "a@test.com"
    assert "hashed_password" not in response.json()

def test_register_duplicate_email(client):
    client.post("/auth/register", json={"email": "a@test.com", "password": "secret123"})
    response = client.post("/auth/register", json={"email": "a@test.com", "password": "secret123"})
    assert response.status_code == 409

def test_login(client):
    client.post("/auth/register", json={"email": "a@test.com", "password": "secret123"})
    response = client.post("/auth/login", json={"email": "a@test.com", "password": "secret123"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_wrong_password(client):
    client.post("/auth/register", json={"email": "a@test.com", "password": "secret123"})
    response = client.post("/auth/login", json={"email": "a@test.com", "password": "wrongpassword"})
    assert response.status_code == 401