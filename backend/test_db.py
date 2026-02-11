
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def main():
    mongo_url = os.environ.get('MONGO_URL')
    print(f"Testing connection to: {mongo_url}")
    
    if not mongo_url:
        print("ERROR: MONGO_URL not found")
        return

    try:
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=2000)
        db = client[os.environ.get('DB_NAME', 'naya_job')]
        # Ping
        await client.admin.command('ping')
        print("MongoDB Connection: SUCCESS")
        
        # Check collections
        collections = await db.list_collection_names()
        print(f"Collections: {collections}")
        
    except Exception as e:
        print(f"MongoDB Connection FAILED: {e}")

if __name__ == "__main__":
    asyncio.run(main())
