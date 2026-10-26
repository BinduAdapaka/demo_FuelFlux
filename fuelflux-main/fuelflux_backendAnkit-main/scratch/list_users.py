import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from dotenv import load_dotenv
load_dotenv()
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from src.db.models.user import User

async def main():
    mongo_url = os.getenv("MONGODB_URL")
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.getenv("MONGODB_DB_NAME", "fuelflux")]
    await init_beanie(database=db, document_models=[User])
    users = await User.find_all().to_list()
    for u in users:
        print(f"User: email={u.email}, phone={u.phone}, roles={u.roles}")

if __name__ == "__main__":
    asyncio.run(main())
