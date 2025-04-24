from sqlalchemy.orm import Session
from typing import Dict, Any

from backend.core.repositories import (
    UserRepository, RoomRepository, InventoryConditionRepository,
    InventoryCategoryRepository, InventoryItemRepository, LogRepository
)
from backend.services.security import create_jwt_token
from backend.configurations.config import SECRET_KEY, CORS_CONFIGURATION, DEFAULT_JWT_EXPIRES_SECONDS, DATABASE_URL, \
    SessionLocal

_repositories: Dict[str, Any] = {}
_services: Dict[str, Any] = {}
_db_session = None


def init_db_session(db_uri=None):
    """Initialize database session"""
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    global _db_session

    if not db_uri:
        # Use default connection string - replace with your actual config
        db_uri = DATABASE_URL

    engine = create_engine(db_uri)
    _db_session = SessionLocal()
    return _db_session


def get_db_session() -> Session:
    """Get the database session"""
    global _db_session
    if _db_session is None:
        _db_session = init_db_session()
    return _db_session


def get_user_repository() -> UserRepository:
    """Get or create UserRepository instance"""
    if "user_repository" not in _repositories:
        _repositories["user_repository"] = UserRepository(get_db_session())
    return _repositories["user_repository"]


def get_room_repository() -> RoomRepository:
    """Get or create RoomRepository instance"""
    if "room_repository" not in _repositories:
        _repositories["room_repository"] = RoomRepository(get_db_session())
    return _repositories["room_repository"]


def get_inventory_condition_repository() -> InventoryConditionRepository:
    """Get or create InventoryConditionRepository instance"""
    if "inventory_condition_repository" not in _repositories:
        _repositories["inventory_condition_repository"] = InventoryConditionRepository(get_db_session())
    return _repositories["inventory_condition_repository"]


def get_inventory_category_repository() -> InventoryCategoryRepository:
    """Get or create InventoryCategoryRepository instance"""
    if "inventory_category_repository" not in _repositories:
        _repositories["inventory_category_repository"] = InventoryCategoryRepository(get_db_session())
    return _repositories["inventory_category_repository"]


def get_inventory_item_repository() -> InventoryItemRepository:
    """Get or create InventoryItemRepository instance"""
    if "inventory_item_repository" not in _repositories:
        _repositories["inventory_item_repository"] = InventoryItemRepository(get_db_session())
    return _repositories["inventory_item_repository"]


def get_log_repository() -> LogRepository:
    """Get or create LogRepository instance"""
    if "log_repository" not in _repositories:
        _repositories["log_repository"] = LogRepository(get_db_session())
    return _repositories["log_repository"]


# Service initialization functions
def get_user_service():
    """Get or create UserService instance"""
    if "user_service" not in _services:
        from backend.services.services import UserService
        _services["user_service"] = UserService(get_user_repository())
    return _services["user_service"]


def get_room_service():
    """Get or create RoomService instance"""
    if "room_service" not in _services:
        from backend.services.services import RoomService
        _services["room_service"] = RoomService(get_room_repository())
    return _services["room_service"]


def get_inventory_condition_service():
    """Get or create InventoryConditionService instance"""
    if "inventory_condition_service" not in _services:
        from backend.services.services import InventoryConditionService
        _services["inventory_condition_service"] = InventoryConditionService(
            get_inventory_condition_repository()
        )
    return _services["inventory_condition_service"]


def get_inventory_category_service():
    """Get or create InventoryCategoryService instance"""
    if "inventory_category_service" not in _services:
        from backend.services.services import InventoryCategoryService
        _services["inventory_category_service"] = InventoryCategoryService(
            get_inventory_category_repository()
        )
    return _services["inventory_category_service"]


def get_inventory_item_service():
    """Get or create InventoryItemService instance"""
    if "inventory_item_service" not in _services:
        from backend.services.services import InventoryItemService
        _services["inventory_item_service"] = InventoryItemService(
            get_inventory_item_repository(),
            get_inventory_condition_repository(),
            get_inventory_category_repository(),
            get_room_repository()
        )
    return _services["inventory_item_service"]


def get_log_service():
    """Get or create LogService instance"""
    if "log_service" not in _services:
        from backend.services.services import LogService
        _services["log_service"] = LogService(get_log_repository())
    return _services["log_service"]


def init_all_dependencies():
    """Initialize all services and repositories at once"""
    get_user_service()
    get_room_service()
    get_inventory_condition_service()
    get_inventory_category_service()
    get_inventory_item_service()
    get_log_service()


def reset_dependencies():
    """Reset all dependencies (useful for testing)"""
    global _repositories, _services
    _repositories = {}
    _services = {}

def close_db_session():
    """Close the database session"""
    global _db_session
    if _db_session is not None:
        _db_session.close()
        _db_session = None