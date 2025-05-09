from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from backend.endpoints.init_endpoints import init_router
from backend.endpoints.endpoints import router
from backend.configurations.database import Base, engine

Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:1234",
]

app = FastAPI(
    title="Inventory Management System",
    description="API for managing inventory items, rooms, users and consumables",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
app.include_router(init_router)

if __name__ == '__main__':
    uvicorn.run(app, port=1234, host="localhost")
