from sqlalchemy.orm import Session
from backend.core.entities import (
    User, Room, InventoryCategory, InventoryItem,
    Consumable, Log, InventoryCondition
)
from typing import Optional, List
from datetime import datetime

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_username(self, username: str) -> Optional[User]:
        return self.db.query(User).filter(User.username == username).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        return self.db.query(User).offset(skip).limit(limit).all()

    def create(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user: User) -> User:
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user_id: int):
        user = self.get_by_id(user_id)
        if user:
            user.deleted_at = datetime.now()
            self.db.commit()

class RoomRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, room_id: int) -> Optional[Room]:
        return self.db.query(Room).filter(Room.id == room_id).first()

    def get_by_name(self, name: str) -> Optional[Room]:
        return self.db.query(Room).filter(Room.name == name).first()

    def get_all(self) -> List[Room]:
        return self.db.query(Room).all()

    def create(self, room: Room) -> Room:
        self.db.add(room)
        self.db.commit()
        self.db.refresh(room)
        return room

    def update(self, room: Room) -> Room:
        self.db.commit()
        self.db.refresh(room)
        return room

    def delete(self, room_id: int):
        room = self.get_by_id(room_id)
        if room:
            self.db.delete(room)
            self.db.commit()

class InventoryCategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, category_id: int) -> Optional[InventoryCategory]:
        return self.db.query(InventoryCategory).filter(InventoryCategory.id == category_id).first()

    def get_by_name(self, name: str) -> Optional[InventoryCategory]:
        return self.db.query(InventoryCategory).filter(InventoryCategory.name == name).first()

    def get_all(self) -> List[InventoryCategory]:
        return self.db.query(InventoryCategory).all()

    def create(self, category: InventoryCategory) -> InventoryCategory:
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category

    def update(self, category: InventoryCategory) -> InventoryCategory:
        self.db.commit()
        self.db.refresh(category)
        return category

    def delete(self, category_id: int):
        category = self.get_by_id(category_id)
        if category:
            self.db.delete(category)
            self.db.commit()

class InventoryItemRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, item_id: int) -> Optional[InventoryItem]:
        return self.db.query(InventoryItem).filter(InventoryItem.id == item_id).first()

    def get_by_number(self, inventory_number: str) -> Optional[InventoryItem]:
        return self.db.query(InventoryItem).filter(InventoryItem.inventory_number == inventory_number).first()

    def get_by_id_with_details(self, item_id: int) -> Optional[dict]:
        result = (
            self.db.query(
                InventoryItem,
                InventoryCategory.name.label("category_name"),
                Room.name.label("room_name")
            )
            .join(InventoryCategory, InventoryItem.category_id == InventoryCategory.id)
            .outerjoin(Room, InventoryItem.room_id == Room.id)
            .filter(InventoryItem.id == item_id)
            .first()
        )

        if not result:
            return None

        item, category_name, room_name = result

        # Преобразуем в словарь с нужными полями
        return {
            **item.__dict__,
            "category_name": category_name,
            "room_name": room_name
        }

    def get_all_with_details(self, skip: int = 0, limit: int = 100) -> List[dict]:
        results = (
            self.db.query(
                InventoryItem,
                InventoryCategory.name.label("category_name"),
                Room.name.label("room_name")
            )
            .join(InventoryCategory, InventoryItem.category_id == InventoryCategory.id)
            .outerjoin(Room, InventoryItem.room_id == Room.id)
            .offset(skip)
            .limit(limit)
            .all()
        )

        # Преобразуем кортежи в словари с нужными полями
        return [
            {
                **item.__dict__,
                "category_name": category_name,
                "room_name": room_name
            }
            for item, category_name, room_name in results
        ]

    def get_all(self, skip: int = 0, limit: int = 100) -> List[InventoryItem]:
        return self.db.query(InventoryItem).offset(skip).limit(limit).all()

    def get_by_room(self, room_id: int) -> List[InventoryItem]:
        return self.db.query(InventoryItem).filter(InventoryItem.room_id == room_id).all()

    def get_by_category(self, category_id: int) -> List[InventoryItem]:
        return self.db.query(InventoryItem).filter(InventoryItem.category_id == category_id).all()

    def get_by_user(self, user_id: int) -> List[InventoryItem]:
        return self.db.query(InventoryItem).filter(InventoryItem.user_id == user_id).all()

    def get_by_condition(self, condition: InventoryCondition) -> List[InventoryItem]:
        return self.db.query(InventoryItem).filter(InventoryItem.condition == condition).all()

    def create(self, item: InventoryItem) -> InventoryItem:
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update(self, item: InventoryItem) -> InventoryItem:
        item.updated_at = datetime.now()
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete(self, item_id: int):
        item = self.get_by_id(item_id)
        if item:
            self.db.delete(item)
            self.db.commit()

    def write_off(self, item_id: int):
        item = self.get_by_id(item_id)
        if item:
            item.is_written_off = True
            item.condition = InventoryCondition.WRITTEN_OFF
            item.updated_at = datetime.now()
            self.db.commit()

class ConsumableRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, consumable_id: int) -> Optional[Consumable]:
        return self.db.query(Consumable).filter(Consumable.id == consumable_id).first()

    def get_by_name(self, name: str) -> Optional[Consumable]:
        return self.db.query(Consumable).filter(Consumable.name == name).first()

    def get_all(self) -> List[Consumable]:
        return self.db.query(Consumable).all()

    def get_low_stock(self) -> List[Consumable]:
        return self.db.query(Consumable).filter(Consumable.quantity <= Consumable.min_quantity).all()

    def create(self, consumable: Consumable) -> Consumable:
        self.db.add(consumable)
        self.db.commit()
        self.db.refresh(consumable)
        return consumable

    def update(self, consumable: Consumable) -> Consumable:
        self.db.commit()
        self.db.refresh(consumable)
        return consumable

    def delete(self, consumable_id: int):
        consumable = self.get_by_id(consumable_id)
        if consumable:
            self.db.delete(consumable)
            self.db.commit()

    def increase_quantity(self, consumable_id: int, amount: int):
        consumable = self.get_by_id(consumable_id)
        if consumable:
            consumable.quantity += amount
            self.db.commit()

    def decrease_quantity(self, consumable_id: int, amount: int):
        consumable = self.get_by_id(consumable_id)
        if consumable:
            consumable.quantity = max(0, consumable.quantity - amount)
            self.db.commit()

class LogRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, log_id: int) -> Optional[Log]:
        return self.db.query(Log).filter(Log.id == log_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Log]:
        return self.db.query(Log).order_by(Log.created_at.desc()).offset(skip).limit(limit).all()

    def get_by_type(self, log_type: int) -> List[Log]:
        return self.db.query(Log).filter(Log.type == log_type).order_by(Log.created_at.desc()).all()

    def get_by_user(self, user_id: int) -> List[Log]:
        return self.db.query(Log).filter(Log.user_id == user_id).order_by(Log.created_at.desc()).all()

    def create(self, log: Log) -> Log:
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log