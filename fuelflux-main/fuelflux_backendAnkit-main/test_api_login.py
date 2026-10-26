import httpx

base_url = "http://127.0.0.1:8000/api/v1"

test_cases = [
    ("Owner@fuelflux.com", "password123", "Capital email"),
    ("owner@fuelflux.com ", "password123", "Email with space"),
    ("9999999992", "password123", "10-digit phone"),
    ("+919999999992", "password123", "+91 phone"),
    ("admin@fuelflux.com", "password123", "Admin email"),
    ("logistic@fuelflux.com", "password123", "Logistic email"),
    ("employee@fuelflux.com", "password123", "Employee email"),
]

for identifier, password, label in test_cases:
    payload = {
        "emailOrPhone": identifier,
        "password": password
    }
    r = httpx.post(f"{base_url}/auth/login", json=payload, timeout=10.0)
    print(f"[{label}] {identifier} -> Status {r.status_code}, Success: {r.json().get('success')}")
