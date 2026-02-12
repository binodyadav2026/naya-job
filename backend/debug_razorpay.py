import requests
import json
import os

BASE_URL = "http://localhost:8001/api"

def login_recruiter():
    # Login as a hardcoded recruiter (or register one if not exists)
    # Since I don't know a valid recruiter password, I can try to register a new one
    email = "test_recruiter_razorpay@example.com"
    password = "password123"
    
    # Try login
    print(f"Logging in as {email}...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
    
    if resp.status_code == 200:
        return resp.json()["token"]
    
    # Try register
    print("Login failed, registering...")
    resp = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email,
        "password": password,
        "name": "Test Recruiter",
        "role": "recruiter"
    })
    
    if resp.status_code == 200:
        return resp.json()["token"]
    
    print(f"Failed to login/register: {resp.text}")
    return None

def test_create_order(token):
    print("\nTesting create-order endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    params = {"plan": "basic"}
    
    resp = requests.post(f"{BASE_URL}/subscriptions/create-order", params=params, headers=headers)
    
    if resp.status_code == 200:
        data = resp.json()
        print(json.dumps(data, indent=2))
        
        if data.get("demo_mode"):
            print("❌ Backend is in DEMO MODE (Razorpay keys not loaded or invalid)")
        else:
            print("✅ Backend is in LIVE MODE (Razorpay configured)")
    else:
        print(f"Error: {resp.status_code} - {resp.text}")

if __name__ == "__main__":
    token = login_recruiter()
    if token:
        test_create_order(token)
