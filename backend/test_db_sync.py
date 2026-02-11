
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import certifi

load_dotenv()

def test():
    print("Testing Sync DB connection...")
    mongo_url = os.environ.get('MONGO_URL')
    
    try:
        # Standard connection
        client = MongoClient(mongo_url, tlsAllowInvalidCertificates=True)
        db = client[os.environ.get('DB_NAME', 'test_db')]
        # Ping
        client.admin.command('ping')
        print("Sync DB Connection SUCCESS!")
    except Exception as e:
        print(f"Sync DB Connection FAILED: {e}")

if __name__ == "__main__":
    test()
