from typing import Type
from sqlalchemy.orm import Session
from typing_extensions import Generic
from config import T
from entities import User, Room, InventoryCondition, InventoryCategory, InventoryItem, Log


class Repository(Generic[T]):
    def __init__(self, model: Type[T], session: Session):
        self.model = model
        self.db = session

    def get_all(self):
        return self.db.query(self.model).all()

    def get_by_id(self, entity_id: int):
        return self.db.query(self.model).filter_by(id=entity_id).first()

    def create(self, entity: Type[T]):
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, entity: Type[T]):
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def delete(self, entity_id: int):
        entity = self.get_by_id(entity_id)
        if entity is None: raise ValueError('entity not found')
        self.db.delete(entity)
        self.db.commit()



class UserRepository(Repository[User]):
    def __init__(self, model: Type[T], session: Session):
        super().__init__(model, session)

    def get_by_username(self, username: str, is_strong: bool = False):
        if is_strong: return self.db.query(User).filter_by(username=username).first()
        return self.db.query(User).filter_by(username=username).all()

    def get_by_email(self, email: str, is_strong: bool = False):
        if is_strong: return self.db.query(User).filter_by(email=email).first()
        return self.db.query(User).filter_by(email=email).all()

    def get_by_phone(self, phone_number: str, is_strong: bool = False):
        if is_strong:return self.db.query(User).filter_by(phone_number=phone_number).first()
        return self.db.query(User).filter_by(phone_number=phone_number).all()

    def get_by_username_and_password(self, username: str, password_hash: str):
        return self.db.query(User).filter_by(
            username=username,
            password_hash=password_hash
        ).first()



class RoomRepository(Repository[Room]):
    def __init__(self, model: Type[T], session: Session):
        super().__init__(model, session)

    def get_by_name(self, name: str):
        return self.db.query(Room).filter_by(name=name).first()


class InventoryConditionRepository(Repository[InventoryCondition]):
    def __init__(self, model: Type[T], session: Session):
        super().__init__(model, session)

    def get_by_name(self, name: str):
        return self.db.query(InventoryCondition).filter_by(name=name).first()


class InventoryCategoryRepository(Repository[InventoryCategory]):
    def __init__(self, model: Type[T], session: Session):
        super().__init__(model, session)

    def get_by_name(self, name: str):
        return self.db.query(InventoryCategory).filter_by(name=name).first()



class InventoryItemRepository(Repository[InventoryItem]):
    def __init__(self, model: Type[T], session: Session):
        super().__init__(model, session)

    def get_by_number(self, number: str):
        return self.db.query(InventoryItem).filter_by(number=number).first()

    def get_by_assigned_user(self, user_id: int):
        return self.db.query(InventoryItem).filter_by(assigned_user_id=user_id).all()

    def get_by_room(self, room_id: int):
        return self.db.query(InventoryItem).filter_by(room_id=room_id).all()

    def get_by_category(self, category_id: int):
        return self.db.query(InventoryItem).filter_by(category_id=category_id).all()

    def get_by_condition(self, condition_id: int):
        return self.db.query(InventoryItem).filter_by(condition_id=condition_id).all()



class LogRepository(Repository[Log]):
    def __init__(self, model: Type[T], session: Session):
        super().__init__(model, session)

    def get_recent(self, limit: int = 100):
        return self.db.query(Log).order_by(Log.created_at.desc()).limit(limit).all()