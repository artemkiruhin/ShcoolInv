from fastapi import FastAPI

import uvicorn
from backend.endpoints.init_endpoints import init_router
from backend.endpoints.endpoints import router
from backend.configurations.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory Management System",
    description="API for managing inventory items, rooms, users and consumables",
    version="1.0.0"
)

app.include_router(router, prefix="/api")
app.include_router(init_router)

if __name__ == '__main__':
    uvicorn.run(app, port=1234, host="localhost")