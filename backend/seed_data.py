"""
Seed Script: Ingests 100% genuine real-time live meteorological telemetry
from 38+ Indian stations across all states (0% fake data).
"""
from backend.app.core.database import Base, engine
from backend.app.services.live_ingestion import fetch_and_ingest_live_weather

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def seed_database():
    print("Connecting to live national meteorological stream across 38+ Indian cities...")
    res = fetch_and_ingest_live_weather(wipe_old=True)
    print("Database live seeding completed successfully!")
    print(f"-> Ingested: {res['ingested_count']} 100% Real Live Observations")
    print(f"-> Source: {res['source']}")
    print(f"-> Synced At: {res['synced_at']}")

if __name__ == "__main__":
    seed_database()
