import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import sys
sys.path.insert(0, '.')
from src.core.security import hash_password

async def main():
    client = AsyncIOMotorClient('mongodb://127.0.0.1:27017')
    db = client['fuelflux']

    # 1. Get pump owner user
    owner = await db['users'].find_one({"email": "owner@fuelflux.com"})
    if not owner:
        print("Error: owner@fuelflux.com user not found in DB")
        return

    owner_id = owner["_id"]
    print(f"Found owner: {owner_id}")

    # 2. Check existing pumps
    existing_pump = await db['pumps'].find_one({"owner_id": owner_id})
    if not existing_pump:
        pump_doc = {
            "name": "FuelFlux City Center Station",
            "org_name": "FuelFlux Energy Cluster",
            "logo_url": None,
            "address": "Plot 42, Western Express Highway, Andheri East",
            "owner_id": owner_id,
            "contact_number": "+919999999992",
            "opening_time": "06:00",
            "closing_time": "23:00",
            "status": "approved",
            "city": "Mumbai",
            "state": "Maharashtra",
            "pincode": "400069",
            "gst": "27AABCF1234F1Z5",
            "license": "PESO-MH-2024-8841",
            "fuel_types": "Petrol, Diesel, Speed Diesel, CNG",
            "tanks_count": 4,
            "nozzles_count": 8,
            "daily_capacity": 45000,
            "latitude": 19.1136,
            "longitude": 72.8697,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        res = await db['pumps'].insert_one(pump_doc)
        pump_id = res.inserted_id
        print(f"Created approved pump: {pump_id}")
    else:
        pump_id = existing_pump["_id"]
        # Ensure status is approved
        await db['pumps'].update_one({"_id": pump_id}, {"$set": {"status": "approved"}})
        print(f"Pump already exists: {pump_id}, marked as approved.")

    # 3. Create or update attendant
    attendant = await db['attendants'].find_one({"employee_id": "FF-001"})
    if not attendant:
        att_doc = {
            "pump_id": pump_id,
            "name": "Ramesh Kumar Sharma",
            "phone": "+919999999994",
            "email": "employee@fuelflux.com",
            "employee_id": "FF-001",
            "designation": "Attendant",
            "shift": "Morning",
            "role": "attendant",
            "hashed_password": hash_password("password123"),
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await db['attendants'].insert_one(att_doc)
        print("Created attendant FF-001 (Ramesh Sharma) with password123")
    else:
        await db['attendants'].update_one(
            {"_id": attendant["_id"]},
            {"$set": {"pump_id": pump_id, "hashed_password": hash_password("password123"), "is_active": True}}
        )
        print("Updated attendant FF-001 with password123 and pump_id")

    print("\nSeed completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
