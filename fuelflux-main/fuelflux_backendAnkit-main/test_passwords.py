import sys
sys.path.insert(0, '.')
from src.core.security import verify_password, hash_password
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

candidate_passwords = [
    "password123", "password", "Password123", "Password@123", "Admin@123", "admin123",
    "owner123", "Owner@123", "fuelflux", "FuelFlux@123", "fuelflux123", "123456", "12345678",
    "admin", "owner", "logistic", "employee"
]

async def main():
    client = AsyncIOMotorClient('mongodb://127.0.0.1:27017')
    db = client['fuelflux']
    users = await db['users'].find({}).to_list(10)
    for u in users:
        email = u.get('email')
        pw_hash = u.get('hashed_password')
        found = False
        for cand in candidate_passwords:
            if verify_password(cand, pw_hash):
                print(f"MATCH FOUND: {email} -> {cand}")
                found = True
                break
        if not found:
            print(f"NO MATCH for {email}")

if __name__ == "__main__":
    asyncio.run(main())
