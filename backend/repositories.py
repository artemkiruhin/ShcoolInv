from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session, Query
from sqlalchemy import desc, or_
from entities import *


class BaseRepository:
    def __init__(self, model, session: Session):
        self.model = model
        self.session = session

    def get_all(self) -> List:
        return self.session.query(self.model).all()

    def get_by_id(self, entity_id: int) -> Optional[Any]:
        return self.session.query(self.model).get(entity_id)

    def create(self, entity) -> Any:
        self.session.add(entity)
        self.session.commit()
        self.session.refresh(entity)
        return entity

    def update(self, entity) -> Any:
        self.session.commit()
        self.session.refresh(entity)
        return entity

    def delete(self, entity: Base) -> bool:
        self.session.delete(entity)
        self.session.commit()
        return True


class UserRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(User, session)

    def get_by_username(self, username: str, exact: bool = True) -> Optional[User]:
        query = self.session.query(User).filter(User.username.ilike(username))
        return query.first() if exact else query.all()

    def get_by_email(self, email: str, exact: bool = True) -> Optional[User]:
        query = self.session.query(User).filter(User.email.ilike(email))
        return query.first() if exact else query.all()

    def get_by_credentials(self, username: str, password_hash: str) -> Optional[User]:
        return self.session.query(User).filter(
            User.username == username,
            User.password_hash == password_hash
        ).first()

    def get_by_all_args(self, username: str | None, email: str | None,
                        full_name: str | None, phone_number: str | None) -> User | None:
        query = self.session.query(User)

        filters = []
        if username is not None:
            filters.append(User.username == username)
        if email is not None:
            filters.append(User.email == email)
        if full_name is not None:
            filters.append(User.full_name == full_name)
        if phone_number is not None:
            filters.append(User.phone_number == phone_number)

        if filters:
            query = query.filter(or_(*filters))

        return query.first()


class RoomRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(Room, session)

    def get_by_name(self, name: str) -> Optional[Room]:
        return self.session.query(Room).filter(Room.name.ilike(name)).first()

    def get_by_short_name(self, short_name: str) -> Optional[Room]:
        return self.session.query(Room).filter(Room.short_name.ilike(short_name)).first()


class InventoryCategoryRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(InventoryCategory, session)

    def get_by_name(self, name: str) -> Optional[InventoryCategory]:
        return self.session.query(InventoryCategory).filter(InventoryCategory.name.ilike(name)).first()

    def get_by_short_name(self, short_name: str) -> Optional[InventoryCategory]:
        return self.session.query(InventoryCategory).filter(InventoryCategory.short_name.ilike(short_name)).first()


class InventoryConditionRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(InventoryCondition, session)

    def get_by_name(self, name: str) -> Optional[InventoryCondition]:
        return self.session.query(InventoryCondition).filter(InventoryCondition.name.ilike(name)).first()


class InventoryItemRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(InventoryItem, session)

    def get_by_number(self, number: str) -> Optional[InventoryItem]:
        return self.session.query(InventoryItem).filter(InventoryItem.number == number).first()

    def get_last_by_category_and_room(self, category_id: int, room_id: Optional[int]) -> Optional[InventoryItem]:
        query = self.session.query(InventoryItem).filter(
            InventoryItem.category_id == category_id
        )

        if room_id:
            query = query.filter(InventoryItem.room_id == room_id)
        else:
            query = query.filter(InventoryItem.room_id.is_(None))

        return query.order_by(InventoryItem.id.desc()).first()

    def search(self, filters: Dict) -> [InventoryItem]:
        query = self.session.query(InventoryItem)

        if 'number' in filters:
            query = query.filter(InventoryItem.number.ilike(f"%{filters['number']}%"))
        if 'name' in filters:
            query = query.filter(InventoryItem.name.ilike(f"%{filters['name']}%"))
        if 'category_id' in filters:
            query = query.filter(InventoryItem.category_id == filters['category_id'])
        if 'room_id' in filters:
            query = query.filter(InventoryItem.room_id == filters['room_id'])
        if 'condition_id' in filters:
            query = query.filter(InventoryItem.condition_id == filters['condition_id'])
        if 'assigned_user_id' in filters:
            query = query.filter(InventoryItem.assigned_user_id == filters['assigned_user_id'])
        if 'is_written_off' in filters:
            query = query.filter(InventoryItem.is_written_off == filters['is_written_off'])

        return query.order_by(InventoryItem.number).all()


class LogRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(Log, session)

    def get_recent(self, limit: int = 100) -> [Log]:
        return self.session.query(Log).order_by(desc(Log.created_at)).limit(limit).all()

    def get_by_user(self, user_id: int, limit: int = 100) -> List[Log]:
        return (
            self.session.query(Log)
            .filter(Log.user_id == user_id)
            .order_by(desc(Log.created_at))
            .limit(limit)
            .all()
        )