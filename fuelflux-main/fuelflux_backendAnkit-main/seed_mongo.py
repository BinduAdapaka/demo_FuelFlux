import asyncio
from src.core.database import init_db, close_db
from src.db.models.user import User
from src.core.security import hash_password

SEED_USERS = [
    {
        "email": "admin@fuelflux.com",
        "phone": "+919999999991",
        "full_name": "FuelFlux Admin",
        "roles": ["admin", "superadmin"],
        "password": "password123",
        "verification_status": None,
    },
    {
        "email": "owner@fuelflux.com",
        "phone": "+919999999992",
        "full_name": "Pump Owner",
        "roles": ["pump_owner"],
        "password": "password123",
        "verification_status": None,
    },
    {
        "email": "logistic@fuelflux.com",
        "phone": "+919999999993",
        "full_name": "Logistic Fleet Partner",
        "roles": ["logistic"],
        "password": "password123",
        "company_name": "FuelFlux Logistics Pvt Ltd",
        "verification_status": "verified",
    },
    {
        "email": "employee@fuelflux.com",
        "phone": "+919999999994",
        "full_name": "Pump Attendant Employee",
        "roles": ["employee"],
        "password": "password123",
        "verification_status": None,
    }
]

async def seed():
    await init_db()
    print("Database connected.")
    
    for udata in SEED_USERS:
        existing = await User.find_one(User.email == udata["email"])
        hpw = hash_password(udata["password"])
        if not existing:
            user = User(
                email=udata["email"],
                phone=udata["phone"],
                full_name=udata["full_name"],
                hashed_password=hpw,
                roles=udata["roles"],
                is_active=True,
                company_name=udata.get("company_name"),
                verification_status=udata.get("verification_status")
            )
            await user.insert()
            print(f"Created user: {udata['email']} (roles: {udata['roles']})")
        else:
            existing.hashed_password = hpw
            existing.roles = udata["roles"]
            existing.is_active = True
            if udata.get("verification_status"):
                existing.verification_status = udata.get("verification_status")
            await existing.save()
            print(f"Updated user: {udata['email']}")
            
    await close_db()
    print("Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed())
