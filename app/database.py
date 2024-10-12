from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

if not os.path.exists('data'):
    os.makedirs('data')

SQLALCHEMY_DATABASE_URL = "sqlite:///./data/patientry.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)