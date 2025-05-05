from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import logging
from typing import List

from backend.configurations.database import get_db
from backend.core.entities import (
    User, Room, InventoryCategory, InventoryItem,
    Consumable, Log, InventoryCondition, LogType
)
from backend.core.repositories import (
    UserRepository, RoomRepository, InventoryCategoryRepository,
    InventoryItemRepository, ConsumableRepository, LogRepository
)

logger = logging.getLogger(__name__)
init_router = APIRouter(prefix="/init", tags=["initialization"])

@init_router.post("/database", summary="Initialize database with sample data")
async def initialize_database(
        db: Session = Depends(get_db),
        force: bool = True,
        create_users: bool = True,
        create_rooms: bool = True,
        create_categories: bool = True,
        create_items: bool = True,
        create_consumables: bool = True,
        create_logs: bool = True
):
    """
    Initialize database with sample data.

    Parameters:
    - force: Reinitialize even if data exists (default: False)
    - create_users: Create sample users (default: True)
    - create_rooms: Create sample rooms (default: True)
    - create_categories: Create sample categories (default: True)
    - create_items: Create sample inventory items (default: True)
    - create_consumables: Create sample consumables (default: True)
    - create_logs: Create sample logs (default: True)
    """
    try:
        if not force:
            user_repo = UserRepository(db)
            if user_repo.get_all(limit=1):
                raise HTTPException(
                    status_code=400,
                    detail="Database already contains data. Use force=True to reinitialize."
                )

        result = {}

        if create_users:
            users = _create_sample_users(db)
            result["users_created"] = len(users)
        else:
            users = UserRepository(db).get_all()
            result["users_existing"] = len(users)

        if create_rooms:
            rooms = _create_sample_rooms(db)
            result["rooms_created"] = len(rooms)
        else:
            rooms = RoomRepository(db).get_all()
            result["rooms_existing"] = len(rooms)

        if create_categories:
            categories = _create_sample_categories(db)
            result["categories_created"] = len(categories)
        else:
            categories = InventoryCategoryRepository(db).get_all()
            result["categories_existing"] = len(categories)

        if create_items and categories and (users or create_users) and (rooms or create_rooms):
            items = _create_sample_inventory_items(db, categories, rooms, users)
            result["inventory_items_created"] = len(items)
        else:
            items = []
            result["inventory_items_skipped"] = "Missing required data"

        if create_consumables:
            consumables = _create_sample_consumables(db)
            result["consumables_created"] = len(consumables)
        else:
            consumables = []
            result["consumables_skipped"] = "Disabled by parameter"

        if create_logs and (users or create_users) and (items or not create_items) and (
                consumables or not create_consumables):
            logs = _create_sample_logs(db, users, items, consumables)
            result["logs_created"] = len(logs)
        else:
            logs = []
            result["logs_skipped"] = "Missing required data"

        return {
            "success": True,
            "message": "Database initialization completed",
            "details": result
        }

    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Database initialization failed: {str(e)}"
        )


def _create_sample_users(db: Session) -> List[User]:
    """Create sample users"""
    repo = UserRepository(db)
    users_data = [
        {
            "username": "admin",
            "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
            "email": "admin@example.com",
            "full_name": "Admin User",
            "phone_number": "+1234567890",
            "is_admin": True
        },
        {
            "username": "manager",
            "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
            "email": "manager@example.com",
            "full_name": "Office Manager",
            "phone_number": "+1777888999",
            "is_admin": True
        },
        {
            "username": "tech",
            "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
            "email": "tech@example.com",
            "full_name": "Tech Support",
            "phone_number": "+1555666777",
            "is_admin": False
        }
    ]

    created_users = []
    for user_data in users_data:
        try:
            user = User.create(**user_data)
            created_user = repo.create(user)
            created_users.append(created_user)
        except Exception as e:
            logger.error(f"Error creating user {user_data['username']}: {str(e)}")

    return created_users


def _create_sample_rooms(db: Session) -> List[Room]:
    """Create sample rooms"""
    repo = RoomRepository(db)
    rooms_data = [
        {"name": "Server Room", "description": "Main server equipment room"},
        {"name": "Development", "description": "Software development office"},
        {"name": "Meeting Room A", "description": "Main conference room"},
        {"name": "Storage", "description": "Equipment storage"}
    ]

    created_rooms = []
    for room_data in rooms_data:
        try:
            room = Room.create(**room_data)
            created_room = repo.create(room)
            created_rooms.append(created_room)
        except Exception as e:
            logger.error(f"Error creating room {room_data['name']}: {str(e)}")

    return created_rooms


def _create_sample_categories(db: Session) -> List[InventoryCategory]:
    """Create sample inventory categories"""
    repo = InventoryCategoryRepository(db)
    categories_data = [
        {
            "name": "Computer Equipment",
            "short_name": "COMP",
            "description": "Computers and accessories"
        },
        {
            "name": "Networking",
            "short_name": "NET",
            "description": "Network equipment"
        },
        {
            "name": "Office Equipment",
            "short_name": "OFFICE",
            "description": "Office devices"
        }
    ]

    created_categories = []
    for category_data in categories_data:
        try:
            category = InventoryCategory.create(**category_data)
            created_category = repo.create(category)
            created_categories.append(created_category)
        except Exception as e:
            logger.error(f"Error creating category {category_data['name']}: {str(e)}")

    return created_categories


def _create_sample_inventory_items(
        db: Session,
        categories: List[InventoryCategory],
        rooms: List[Room],
        users: List[User]
) -> List[InventoryItem]:
    """Create sample inventory items"""
    if not categories or not rooms or not users:
        logger.warning("Skipping inventory items creation - missing required data")
        return []

    repo = InventoryItemRepository(db)
    items = []

    def get_random(items_list, none_chance=0.2):
        if random.random() < none_chance or not items_list:
            return None
        return random.choice(items_list)

    comp_category = next((c for c in categories if c.short_name == "COMP"), None)
    if comp_category:
        for i in range(1, 6):
            try:
                room = get_random(rooms)
                user = get_random(users)

                item = InventoryItem.create(
                    inventory_number=f"COMP-{1000 + i}",
                    name=f"Dell Laptop {i}",
                    description="Business laptop",
                    category_id=comp_category.id,
                    condition=random.choice(list(InventoryCondition)),
                    room_id=room.id if room else None,
                    user_id=user.id if user else None,
                    purchase_date=datetime.now() - timedelta(days=random.randint(30, 365)),
                    purchase_price=1000 + random.randint(-200, 200),
                    warranty_until=datetime.now() + timedelta(days=random.randint(30, 365)))

                created_item = repo.create(item)
                items.append(created_item)
            except Exception as e:
                logger.error(f"Error creating computer item {i}: {str(e)}")

    return items


def _create_sample_consumables(db: Session) -> List[Consumable]:
    """Create sample consumables"""
    repo = ConsumableRepository(db)
    consumables_data = [
        {
            "name": "Printer Paper",
            "description": "A4 paper",
            "quantity": 500,
            "min_quantity": 100,
            "unit": "sheets"
        },
        {
            "name": "Toner Cartridge",
            "description": "Black toner",
            "quantity": 5,
            "min_quantity": 2,
            "unit": "pcs"
        }
    ]

    created_consumables = []
    for consumable_data in consumables_data:
        try:
            consumable = Consumable.create(**consumable_data)
            created_consumable = repo.create(consumable)
            created_consumables.append(created_consumable)
        except Exception as e:
            logger.error(f"Error creating consumable {consumable_data['name']}: {str(e)}")

    return created_consumables


def _create_sample_logs(
        db: Session,
        users: List[User],
        items: List[InventoryItem],
        consumables: List[Consumable]
) -> List[Log]:
    """Create sample logs"""
    if not users:
        logger.warning("Skipping logs creation - no users available")
        return []

    repo = LogRepository(db)
    logs = []

    for _ in range(5):
        user = random.choice(users)
        try:
            log = Log.create(
                description=f"User {user.username} logged in",
                type=LogType.INFO.value,
                user_id=user.id
            )
            created_log = repo.create(log)
            logs.append(created_log)
        except Exception as e:
            logger.error(f"Error creating user log: {str(e)}", exc_info=True)

    if items:
        for _ in range(3):
            item = random.choice(items)
            user = random.choice(users)
            try:
                log = Log.create(
                    description=f"Inventory item {item.name} was checked",
                    type=LogType.INFO.value,
                    user_id=user.id
                )
                created_log = repo.create(log)
                logs.append(created_log)
            except Exception as e:
                logger.error(f"Error creating inventory log: {str(e)}", exc_info=True)

    if consumables:
        for _ in range(2):
            consumable = random.choice(consumables)
            user = random.choice(users)
            try:
                log = Log.create(
                    description=f"Consumable {consumable.name} stock updated",
                    type=LogType.INFO.value,
                    user_id=user.id
                )
                created_log = repo.create(log)
                logs.append(created_log)
            except Exception as e:
                logger.error(f"Error creating consumable log: {str(e)}", exc_info=True)

    return logs