import sys
from pathlib import Path

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from database import engine, Base, SessionLocal
from models import FoodCommodity, PackagingMaterial, RespirationKinetics

def initialize_database():
    print("[DB INIT] Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if already populated
        existing_commodities = db.query(FoodCommodity).count()
        if existing_commodities >= 100:
            print(f"[DB INIT] Database already seeded with {existing_commodities} commodities.")
            return

        print("[DB INIT] Seeding database from schema.sql...")
        schema_path = BASE_DIR.parent / "database" / "schema.sql"
        if schema_path.exists():
            with open(schema_path, "r", encoding="utf-8") as f:
                sql_script = f.read()

            # Execute SQL statements safely
            # SQLite does not support multiple statements in execute() without executescript()
            with engine.connect() as conn:
                raw_conn = conn.connection
                cursor = raw_conn.cursor()
                cursor.executescript(sql_script)
                raw_conn.commit()

            count = db.query(FoodCommodity).count()
            mat_count = db.query(PackagingMaterial).count()
            print(f"[DB INIT] Successfully seeded {count} food commodities and {mat_count} packaging materials!")
        else:
            print(f"[DB INIT WARNING] schema.sql not found at {schema_path}!")
    except Exception as e:
        print(f"[DB INIT ERROR] Error during initialization: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    initialize_database()
