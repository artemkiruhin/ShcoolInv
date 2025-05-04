from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session, Query
from sqlalchemy import desc, or_
from backend.core.dtos import LogType
from backend.core.entities import InventoryCategory, InventoryItem, InventoryCondition, User, Room, Log, Consumable
from typing import List, Optional, Union
from sqlalchemy.orm import Session, Query
from sqlalchemy import or_, and_

from backend.configurations.config import Base


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



class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[User]:
        """Get all users"""
        return self.session.query(User).all()

    def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        return self.session.query(User).get(user_id)

    def create(self, user: User) -> User:
        """Create new user"""
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def update(self, user: User) -> User:
        """Update existing user"""
        self.session.commit()
        self.session.refresh(user)
        return user

    def delete(self, user: User) -> bool:
        """Delete user"""
        self.session.delete(user)
        self.session.commit()
        return True

    def get_by_username(self, username: str, exact: bool = True) -> Union[Optional[User], List[User]]:
        """
        Get user by username
        :param username: Username to search
        :param exact: If True - exact match, False - partial match
        :return: Single user if exact=True, list of users if exact=False
        """
        query = self.session.query(User)
        if exact:
            query = query.filter(User.username == username)
            return query.first()
        else:
            query = query.filter(User.username.ilike(f"%{username}%"))
            return query.all()

    def get_by_email(self, email: str, exact: bool = True) -> Union[Optional[User], List[User]]:
        """
        Get user by email
        :param email: Email to search
        :param exact: If True - exact match, False - partial match
        :return: Single user if exact=True, list of users if exact=False
        """
        query = self.session.query(User)
        if exact:
            query = query.filter(User.email == email)
            return query.first()
        else:
            query = query.filter(User.email.ilike(f"%{email}%"))
            return query.all()

    def get_by_credentials(self, username: str, password_hash: str) -> Optional[User]:
        """Get user by username and password hash"""
        return self.session.query(User).filter(
            and_(
                User.username == username,
                User.password_hash == password_hash
            )
        ).first()

    def search(self, username: Optional[str] = None,
               email: Optional[str] = None,
               full_name: Optional[str] = None,
               phone_number: Optional[str] = None,
               is_active: Optional[bool] = None) -> List[User]:
        """
        Search users with multiple filters
        :param username: Partial username match
        :param email: Partial email match
        :param full_name: Partial full name match
        :param phone_number: Partial phone number match
        :param is_active: Active status filter
        :return: List of matching users
        """
        query = self.session.query(User)

        filters = []
        if username:
            filters.append(User.username.ilike(f"%{username}%"))
        if email:
            filters.append(User.email.ilike(f"%{email}%"))
        if full_name:
            filters.append(User.full_name.ilike(f"%{full_name}%"))
        if phone_number:
            filters.append(User.phone_number.ilike(f"%{phone_number}%"))
        if is_active is not None:
            filters.append(User.is_active == is_active)

        if filters:
            query = query.filter(or_(*filters))

        return query.order_by(User.username).all()

    def exists_with_username(self, username: str) -> bool:
        """Check if user with given username exists"""
        return self.session.query(
            self.session.query(User)
            .filter(User.username == username)
            .exists()
        ).scalar()

    def exists_with_email(self, email: str) -> bool:
        """Check if user with given email exists"""
        return self.session.query(
            self.session.query(User)
            .filter(User.email == email)
            .exists()
        ).scalar()

    def get_admins(self) -> List[User]:
        """Get all admin users"""
        return self.session.query(User).filter(User.is_admin == True).all()

    def activate_user(self, user_id: int) -> bool:
        """Activate user account"""
        user = self.get_by_id(user_id)
        if not user:
            return False

        user.is_active = True
        self.session.commit()
        return True

    def deactivate_user(self, user_id: int) -> bool:
        """Deactivate user account"""
        user = self.get_by_id(user_id)
        if not user:
            return False

        user.is_active = False
        self.session.commit()
        return True

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

    def get_by_category(self, category_id: int):
        return self.session.query(InventoryItem).filter_by(category_id=category_id).all()

    def get_by_room(self, room_id: int):
        return self.session.query(InventoryItem).filter_by(room_id=room_id).all()

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

    def get_by_status(self, log_status: LogType) -> [Log]:
        return self.session.query(Log).filter_by(type=log_status)


class ConsumableRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(Consumable, session)

    def get_by_name(self, name: str) -> Optional[Consumable]:
        return self.session.query(Consumable).filter(Consumable.name.ilike(name)).first()