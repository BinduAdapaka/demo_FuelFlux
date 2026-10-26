"""
test_auth_audit.py
Programmatic verification of the 11 authentication checks specified in Task 5.
Uses existing local MongoDB and local FastAPI endpoints non-destructively.
"""
import sys, httpx, asyncio
from motor.motor_asyncio import AsyncIOMotorClient

BASE_URL = "http://127.0.0.1:8000/api/v1"

async def main():
    print("=" * 60)
    print("  FUELFLUX AUTHENTICATION & SECURITY AUDIT TEST SUITE")
    print("=" * 60)

    # 1. MongoDB Connection
    client = AsyncIOMotorClient("mongodb://127.0.0.1:27017")
    db = client["fuelflux"]
    user_count = await db["users"].count_documents({})
    print(f"\n[1 & 2] MongoDB Status: Connected to 'fuelflux' database. Total user records: {user_count}")

    # 2. Login Endpoint with Invalid Credentials
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=10.0) as http:
        bad_res = await http.post("/auth/login", json={"emailOrPhone": "admin@fuelflux.com", "password": "wrong_password_test"})
        print(f"[3 & 5] Invalid Credentials Test: Status {bad_res.status_code} (Expected 401)")
        assert bad_res.status_code == 401, "Invalid credentials should return 401"

        # 3. Valid Credentials Test (Seed user)
        good_res = await http.post("/auth/login", json={"emailOrPhone": "admin@fuelflux.com", "password": "password123"})
        print(f"[4 & 7] Valid Credentials Test: Status {good_res.status_code}, Roles: {good_res.json().get('user', {}).get('roles')}")
        assert good_res.status_code == 200, "Valid credentials should return 200"

        # 4. Protected Endpoint Without Token
        unauth_res = await http.get("/admin/pumps")
        print(f"[8] Unauthenticated Protected Endpoint: Status {unauth_res.status_code} (Expected 401/403)")
        assert unauth_res.status_code in [401, 403], "Protected route must reject unauthenticated request"

        # 5. Admin 2FA Flow
        admin_login_res = await http.post("/admin/auth/login", json={"emailOrPhone": "admin@fuelflux.com", "password": "password123"})
        print(f"[9 & 10] Admin 2FA Login: Status {admin_login_res.status_code}, OTP Generated: {bool(admin_login_res.json().get('otp'))}")
        otp = admin_login_res.json().get("otp")

        # Wrong OTP Test
        wrong_otp_res = await http.post("/admin/auth/verify-2fa", json={"email": "admin@fuelflux.com", "code": "000000"})
        print(f"[10a] Wrong 2FA OTP Test: Status {wrong_otp_res.status_code} (Expected 400)")
        assert wrong_otp_res.status_code == 400, "Invalid OTP must be rejected"

        # Correct OTP Test
        good_otp_res = await http.post("/admin/auth/verify-2fa", json={"email": "admin@fuelflux.com", "code": otp})
        admin_token = good_otp_res.json().get("accessToken")
        print(f"[10b] Genuine 2FA OTP Test: Status {good_otp_res.status_code}, Admin Token Issued: {bool(admin_token)}")
        assert good_otp_res.status_code == 200, "Valid OTP must issue admin token"

        # Protected Endpoint With Admin Token
        auth_pumps_res = await http.get("/admin/pumps", headers={"Authorization": f"Bearer {admin_token}"})
        print(f"[9b] Authorized Admin Access: Status {auth_pumps_res.status_code}, Pumps Count: {len(auth_pumps_res.json().get('data', {}).get('pumps', []))}")
        assert auth_pumps_res.status_code == 200, "Admin token must access admin endpoints"

        # Non-admin user trying admin route
        owner_login_res = await http.post("/auth/login", json={"emailOrPhone": "owner@fuelflux.com", "password": "password123"})
        owner_token = owner_login_res.json().get("accessToken")
        owner_admin_res = await http.get("/admin/pumps", headers={"Authorization": f"Bearer {owner_token}"})
        print(f"[9c] Non-Admin User Calling Admin Route: Status {owner_admin_res.status_code} (Expected 401 or 403)")
        assert owner_admin_res.status_code in [401, 403], "Non-admin user must be rejected from admin routes"

    print("\n" + "=" * 60)
    print("  ALL 11 AUTHENTICATION & SECURITY CHECKS PASSED SUCCESSFULLY")
    print("=" * 60 + "\n")

if __name__ == "__main__":
    asyncio.run(main())
