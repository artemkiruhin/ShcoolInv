from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base

DATABASE_URL = "db_driver://db_username:db_password@host_address:db_port/db_name"
engine = create_engine(DATABASE_URL)
Base = declarative_base()