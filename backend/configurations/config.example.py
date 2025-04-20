from typing import TypeVar
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "db_driver://db_username:db_password@host_address:db_port/db_name"
engine = create_engine(DATABASE_URL)
Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
T = TypeVar('T', bound=Base)
SECRET_KEY = "your_super_secret_key"
ALGORITHM = "HS256" # encode JWT token algorithm
DEFAULT_JWT_EXPIRES_HOURS = 24
DEFAULT_JWT_EXPIRES_SECONDS = DEFAULT_JWT_EXPIRES_HOURS * 360

CORS_CONFIGURATION = {
    r"/*": {
        "origins": "http://localhost:3000",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        "allow_headers": "*",
        "supports_credentials": True
    }
}