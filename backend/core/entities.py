from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, DECIMAL, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from backend.configurations.config import Base
from datetime import datetime
from pytz import timezone
from sqlalchemy import LargeBinary
from enum import Enum as PyEnum, Enum


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=False, unique=True)
    password_hash = Column(String(260), nullable=False)
    email = Column(String(50), nullable=False, unique=True)
    full_name = Column(String(100), nullable=False)
    phone_number = Column(String(11), nullable=False)
    registered_at = Column(DateTime(timezone=True), nullable=False,
                           default=lambda: datetime.now(timezone('Europe/Moscow')))
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    is_admin = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)
    avatar = Column(LargeBinary, nullable=True)

    items = relationship("InventoryItem", back_populates="user")

    @staticmethod
    def create(username, password_hash, email, full_name, phone_number, is_admin=False, avatar=None):
        return User(
            username=username,
            password_hash=password_hash,
            email=email,
            full_name=full_name,
            phone_number=phone_number,
            is_admin=is_admin,
            avatar=avatar
        )


class Room(Base):
    __tablename__ = 'rooms'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    description = Column(String(200), nullable=True)

    items = relationship("InventoryItem", back_populates="room")

    @staticmethod
    def create(name, description=None):
        return Room(name=name, description=description)


class InventoryCondition(str, Enum):
    NORMAL = "NORMAL"
    REQUIRES_REPAIR = "REQUIRES_REPAIR"
    WRITTEN_OFF = "WRITTEN_OFF"

class InventoryCategory(Base):
    __tablename__ = 'inventory_category'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    short_name = Column(String(10), nullable=False, unique=True)
    description = Column(String, nullable=True)

    items = relationship("InventoryItem", back_populates="category")

    @staticmethod
    def create(name, short_name, description=None):
        return InventoryCategory(
            name=name,
            short_name=short_name,
            description=description
        )


class InventoryItem(Base):
    __tablename__ = 'inventory_items'
    id = Column(Integer, primary_key=True)
    inventory_number = Column(String(50), nullable=False, unique=True)
    name = Column(String(100), nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False,
                       default=lambda: datetime.now(timezone('Europe/Moscow')))
    updated_at = Column(DateTime(timezone=True), nullable=True)
    condition = Column(SQLAlchemyEnum(InventoryCondition), nullable=False)  # Используем Enum
    category_id = Column(Integer, ForeignKey('inventory_category.id'), nullable=False)
    room_id = Column(Integer, ForeignKey('rooms.id'), nullable=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    photo = Column(LargeBinary, nullable=True)
    purchase_date = Column(DateTime(timezone=True), nullable=True)
    purchase_price = Column(DECIMAL(10, 2), nullable=True)
    warranty_until = Column(DateTime(timezone=True), nullable=True)
    is_written_off = Column(Boolean, nullable=False, default=False)

    category = relationship("InventoryCategory", back_populates="items")
    room = relationship("Room", back_populates="items")
    user = relationship("User", back_populates="items")

    @staticmethod
    def create(inventory_number, name, description, category_id, condition,
              room_id=None, user_id=None, photo=None, purchase_date=None,
              purchase_price=None, warranty_until=None):
        return InventoryItem(
            inventory_number=inventory_number,
            name=name,
            description=description,
            category_id=category_id,
            condition=condition,
            room_id=room_id,
            user_id=user_id,
            photo=photo,
            purchase_date=purchase_date,
            purchase_price=purchase_price,
            warranty_until=warranty_until
        )

class Consumable(Base):
    __tablename__ = 'consumables'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String, nullable=True)
    quantity = Column(Integer, nullable=False, default=0)
    min_quantity = Column(Integer, nullable=False, default=1)
    unit = Column(String(20), nullable=False, default='шт.')

    @staticmethod
    def create(name, description=None, quantity=0, min_quantity=1, unit='шт.'):
        return Consumable(
            name=name,
            description=description,
            quantity=quantity,
            min_quantity=min_quantity,
            unit=unit
        )


class LogType(PyEnum):
    INFO = 1
    WARNING = 2
    ERROR = 3
    CRITICAL = 4


class Log(Base):
    __tablename__ = 'logs'
    id = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)
    type = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False,
                        default=lambda: datetime.now(timezone('Europe/Moscow')))
    related_entity_link = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)

    user = relationship("User")

    @staticmethod
    def create(description, type, related_entity_link=None, user_id=None):
        return Log(
            description=description,
            type=type,
            related_entity_link=related_entity_link,
            user_id=user_id
        )