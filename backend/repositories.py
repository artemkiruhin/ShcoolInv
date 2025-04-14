from datetime import datetime
from typing import Optional, List, Union
from pytz import timezone
from sqlalchemy.orm import Session

from entities import User, Room, InventoryCondition, InventoryCategory, InventoryItem, Log


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, is_admin: Optional[bool] = None, is_active: Optional[bool] = None) -> List[User]:
        users_query = self.db.query(User)

        if is_admin is not None:
            users_query = users_query.filter(User.is_admin == is_admin)
        if is_active is not None:
            users_query = users_query.filter(User.is_active == is_active)

        return users_query.all()

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter_by(id=user_id).first()

    def get_by_username(self, username: str, is_strong: bool = False) -> Union[Optional[User], List[User]]:
        if is_strong:
            return self.db.query(User).filter_by(username=username).first()
        return self.db.query(User).filter_by(username=username).all()

    def get_by_email(self, email: str, is_strong: bool = False) -> Union[Optional[User], List[User]]:
        if is_strong:
            return self.db.query(User).filter_by(email=email).first()
        return self.db.query(User).filter_by(email=email).all()

    def get_by_phone(self, phone_number: str, is_strong: bool = False) -> Union[Optional[User], List[User]]:
        if is_strong:
            return self.db.query(User).filter_by(phone_number=phone_number).first()
        return self.db.query(User).filter_by(phone_number=phone_number).all()

    def get_by_username_and_password(self, username: str, password_hash: str) -> Optional[User]:
        return self.db.query(User).filter_by(
            username=username,
            password_hash=password_hash
        ).first()

    def create(self, username: str, password_hash: str, email: str,
               full_name: str, phone_number: str, is_admin: bool = False) -> User:
        if self.get_by_username(username, True):
            raise ValueError(f'User with username {username} already exists')

        if self.get_by_email(email, True):
            raise ValueError(f'User with email {email} already exists')

        if self.get_by_phone(phone_number, True):
            raise ValueError(f'User with phone {phone_number} already exists')

        new_user = User.create(
            username=username,
            password_hash=password_hash,
            email=email,
            full_name=full_name,
            phone_number=phone_number,
            is_admin=is_admin
        )

        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return new_user

    def update(self, user_id: int, password_hash: Optional[str] = None,
               email: Optional[str] = None, full_name: Optional[str] = None,
               phone_number: Optional[str] = None, is_admin: Optional[bool] = None) -> bool:
        user = self.get_by_id(user_id)
        if not user:
            return False

        if password_hash is not None:
            user.password_hash = password_hash

        if email is not None and email != user.email:
            if self.get_by_email(email, True):
                raise ValueError(f'User with email {email} already exists')
            user.email = email

        if full_name is not None:
            user.full_name = full_name

        if phone_number is not None and phone_number != user.phone_number:
            if self.get_by_phone(phone_number, True):
                raise ValueError(f'User with phone {phone_number} already exists')
            user.phone_number = phone_number

        if is_admin is not None:
            user.is_admin = is_admin

        user.updated_at = datetime.now(timezone('Europe/Moscow'))
        self.db.commit()
        return True

    def delete(self, user_id: int, is_strong: bool = False) -> None:
        user = self.get_by_id(user_id)
        if not user:
            raise ValueError(f'User with id {user_id} does not exist')

        if is_strong:
            self.db.delete(user)
        else:
            user.is_active = False
            user.deleted_at = datetime.now(timezone('Europe/Moscow'))

        self.db.commit()


class RoomRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Room]:
        return self.db.query(Room).all()

    def get_by_id(self, room_id: int) -> Optional[Room]:
        return self.db.query(Room).filter_by(id=room_id).first()

    def get_by_name(self, name: str) -> Optional[Room]:
        return self.db.query(Room).filter_by(name=name).first()

    def create(self, name: str) -> Room:
        if self.get_by_name(name):
            raise ValueError(f'Room with name {name} already exists')

        new_room = Room.create(name=name)
        self.db.add(new_room)
        self.db.commit()
        self.db.refresh(new_room)
        return new_room

    def update(self, room_id: int, name: str) -> bool:
        room = self.get_by_id(room_id)
        if not room:
            return False

        if name != room.name and self.get_by_name(name):
            raise ValueError(f'Room with name {name} already exists')

        room.name = name
        self.db.commit()
        return True

    def delete(self, room_id: int) -> None:
        room = self.get_by_id(room_id)
        if not room:
            raise ValueError(f'Room with id {room_id} does not exist')

        if room.items:
            raise ValueError('Cannot delete room with associated inventory items')

        self.db.delete(room)
        self.db.commit()


class InventoryConditionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[InventoryCondition]:
        return self.db.query(InventoryCondition).all()

    def get_by_id(self, condition_id: int) -> Optional[InventoryCondition]:
        return self.db.query(InventoryCondition).filter_by(id=condition_id).first()

    def get_by_name(self, name: str) -> Optional[InventoryCondition]:
        return self.db.query(InventoryCondition).filter_by(name=name).first()

    def create(self, name: str, description: Optional[str] = None) -> InventoryCondition:
        if self.get_by_name(name):
            raise ValueError(f'Condition with name {name} already exists')

        new_condition = InventoryCondition.create(name=name, description=description)
        self.db.add(new_condition)
        self.db.commit()
        self.db.refresh(new_condition)
        return new_condition

    def update(self, condition_id: int, name: Optional[str] = None,
               description: Optional[str] = None) -> bool:
        condition = self.get_by_id(condition_id)
        if not condition:
            return False

        if name is not None and name != condition.name:
            if self.get_by_name(name):
                raise ValueError(f'Condition with name {name} already exists')
            condition.name = name

        if description is not None:
            condition.description = description

        self.db.commit()
        return True

    def delete(self, condition_id: int) -> None:
        condition = self.get_by_id(condition_id)
        if not condition:
            raise ValueError(f'Condition with id {condition_id} does not exist')

        if condition.items:
            raise ValueError('Cannot delete condition with associated inventory items')

        self.db.delete(condition)
        self.db.commit()


class InventoryCategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[InventoryCategory]:
        return self.db.query(InventoryCategory).all()

    def get_by_id(self, category_id: int) -> Optional[InventoryCategory]:
        return self.db.query(InventoryCategory).filter_by(id=category_id).first()

    def get_by_name(self, name: str) -> Optional[InventoryCategory]:
        return self.db.query(InventoryCategory).filter_by(name=name).first()

    def create(self, name: str, description: Optional[str] = None) -> InventoryCategory:
        if self.get_by_name(name):
            raise ValueError(f'Category with name {name} already exists')

        new_category = InventoryCategory.create(name=name, description=description)
        self.db.add(new_category)
        self.db.commit()
        self.db.refresh(new_category)
        return new_category

    def update(self, category_id: int, name: Optional[str] = None,
               description: Optional[str] = None) -> bool:
        category = self.get_by_id(category_id)
        if not category:
            return False

        if name is not None and name != category.name:
            if self.get_by_name(name):
                raise ValueError(f'Category with name {name} already exists')
            category.name = name

        if description is not None:
            category.description = description

        self.db.commit()
        return True

    def delete(self, category_id: int) -> None:
        category = self.get_by_id(category_id)
        if not category:
            raise ValueError(f'Category with id {category_id} does not exist')

        if category.items:
            raise ValueError('Cannot delete category with associated inventory items')

        self.db.delete(category)
        self.db.commit()


class InventoryItemRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, is_written_off: Optional[bool] = None) -> List[InventoryItem]:
        query = self.db.query(InventoryItem)
        if is_written_off is not None:
            query = query.filter(InventoryItem.is_written_off == is_written_off)
        return query.all()

    def get_by_id(self, item_id: int) -> Optional[InventoryItem]:
        return self.db.query(InventoryItem).filter_by(id=item_id).first()

    def get_by_number(self, number: str) -> Optional[InventoryItem]:
        return self.db.query(InventoryItem).filter_by(number=number).first()

    def get_by_assigned_user(self, user_id: int) -> List[InventoryItem]:
        return self.db.query(InventoryItem).filter_by(assigned_user_id=user_id).all()

    def get_by_room(self, room_id: int) -> List[InventoryItem]:
        return self.db.query(InventoryItem).filter_by(room_id=room_id).all()

    def get_by_category(self, category_id: int) -> List[InventoryItem]:
        return self.db.query(InventoryItem).filter_by(category_id=category_id).all()

    def get_by_condition(self, condition_id: int) -> List[InventoryItem]:
        return self.db.query(InventoryItem).filter_by(condition_id=condition_id).all()

    def create(self, number: str, name: str, description: str, category_id: int,
               assigned_user_id: int, condition_id: int, room_id: Optional[int] = None,
               photo_path: Optional[str] = None, purchase_date: Optional[datetime] = None,
               purchase_price: Optional[float] = None, warranty_until: Optional[datetime] = None) -> InventoryItem:
        if self.get_by_number(number):
            raise ValueError(f'Item with number {number} already exists')

        new_item = InventoryItem.create(
            number=number,
            name=name,
            description=description,
            category_id=category_id,
            room_id=room_id,
            assigned_user_id=assigned_user_id,
            photo_path=photo_path,
            purchase_date=purchase_date,
            purchase_price=purchase_price,
            warranty_until=warranty_until,
            condition_id=condition_id
        )

        self.db.add(new_item)
        self.db.commit()
        self.db.refresh(new_item)
        return new_item

    def update(self, item_id: int, number: Optional[str] = None, name: Optional[str] = None,
               description: Optional[str] = None, category_id: Optional[int] = None,
               room_id: Optional[int] = None, assigned_user_id: Optional[int] = None,
               condition_id: Optional[int] = None, photo_path: Optional[str] = None,
               purchase_date: Optional[datetime] = None, purchase_price: Optional[float] = None,
               warranty_until: Optional[datetime] = None, is_written_off: Optional[bool] = None) -> bool:
        item = self.get_by_id(item_id)
        if not item:
            return False

        if number is not None and number != item.number:
            if self.get_by_number(number):
                raise ValueError(f'Item with number {number} already exists')
            item.number = number

        if name is not None:
            item.name = name

        if description is not None:
            item.description = description

        if category_id is not None:
            item.category_id = category_id

        if room_id is not None:
            item.room_id = room_id

        if assigned_user_id is not None:
            item.assigned_user_id = assigned_user_id

        if condition_id is not None:
            item.condition_id = condition_id

        if photo_path is not None:
            item.photo_path = photo_path

        if purchase_date is not None:
            item.purchase_date = purchase_date

        if purchase_price is not None:
            item.purchase_price = purchase_price

        if warranty_until is not None:
            item.warranty_until = warranty_until

        if is_written_off is not None:
            item.is_written_off = is_written_off

        item.updated_at = datetime.now(timezone('Europe/Moscow'))
        self.db.commit()
        return True

    def delete(self, item_id: int) -> None:
        item = self.get_by_id(item_id)
        if not item:
            raise ValueError(f'Item with id {item_id} does not exist')

        self.db.delete(item)
        self.db.commit()


class LogRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, log_type: Optional[int] = None) -> List[Log]:
        query = self.db.query(Log)
        if log_type is not None:
            query = query.filter(Log.type == log_type)
        return query.order_by(Log.created_at.desc()).all()

    def get_by_id(self, log_id: int) -> Optional[Log]:
        return self.db.query(Log).filter_by(id=log_id).first()

    def create(self, description: str, log_type: int, related_entity_link: Optional[str] = None) -> Log:
        new_log = Log.create(
            description=description,
            type=log_type,
            related_entity_link=related_entity_link
        )
        self.db.add(new_log)
        self.db.commit()
        self.db.refresh(new_log)
        return new_log

    def get_recent(self, limit: int = 100) -> List[Log]:
        return self.db.query(Log).order_by(Log.created_at.desc()).limit(limit).all()