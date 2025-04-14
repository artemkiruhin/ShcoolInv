from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
from config import Base
from datetime import datetime
from pytz import timezone


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=False, unique=True)
    password_hash = Column(String(260), nullable=False)
    email = Column(String(50), nullable=False, unique=True)
    full_name = Column(String(100), nullable=False)
    phone_number = Column(String(11), nullable=False)
    registered_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone('Europe/Moscow')))
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    is_admin = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)
    avatar_path = Column(String, nullable=True)

    assigned_items = relationship("InventoryItem", back_populates="assigned_user")

    @staticmethod
    def create(username, password_hash, email, full_name, phone_number, is_admin=False):
        return User(
            username=username,
            password_hash=password_hash,
            email=email,
            full_name=full_name,
            phone_number=phone_number,
            is_admin=is_admin
        )


class Room(Base):
    __tablename__ = 'rooms'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)

    items = relationship("InventoryItem", back_populates="room")

    @staticmethod
    def create(name):
        return Room(name=name)


class InventoryCondition(Base):
    __tablename__ = 'inventory_conditions'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    description = Column(String, nullable=True)

    items = relationship("InventoryItem", back_populates="condition")

    @staticmethod
    def create(name, description=None):
        return InventoryCondition(
            name=name,
            description=description
        )


class InventoryCategory(Base):
    __tablename__ = 'inventory_category'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    description = Column(String, nullable=True)

    items = relationship("InventoryItem", back_populates="category")

    @staticmethod
    def create(name, description=None):
        return InventoryCategory(
            name=name,
            description=description
        )


class InventoryItem(Base):
    __tablename__ = 'inventory_items'
    id = Column(Integer, primary_key=True)
    number = Column(String(50), nullable=False, unique=True)
    name = Column(String(50), nullable=False)
    description = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False,
                        default=lambda: datetime.now(timezone('Europe/Moscow')))
    updated_at = Column(DateTime(timezone=True), nullable=True)

    condition_id = Column(Integer, ForeignKey('inventory_conditions.id'), nullable=False)
    category_id = Column(Integer, ForeignKey('inventory_category.id'), nullable=False)
    room_id = Column(Integer, ForeignKey('rooms.id'), nullable=True)
    assigned_user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    photo_path = Column(String, nullable=True)
    purchase_date = Column(DateTime(timezone=True), nullable=True)
    purchase_price = Column(DECIMAL, nullable=True)
    warranty_until = Column(DateTime(timezone=True), nullable=False)
    is_written_off = Column(Boolean, nullable=False, default=False)

    condition = relationship("InventoryCondition", back_populates="items")
    category = relationship("InventoryCategory", back_populates="items")
    room = relationship("Room", back_populates="items")
    assigned_user = relationship("User", back_populates="assigned_items")

    @staticmethod
    def create(number, name, description, category_id, room_id, assigned_user_id,
               photo_path=None, purchase_date=None, purchase_price=None, warranty_until=None):
        return InventoryItem(
            number=number,
            name=name,
            description=description,
            category_id=category_id,
            room_id=room_id,
            assigned_user_id=assigned_user_id,
            photo_path=photo_path,
            purchase_date=purchase_date,
            purchase_price=purchase_price,
            warranty_until=warranty_until
        )


class Log(Base):
    __tablename__ = 'logs'
    id = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)
    type = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False,
                        default=lambda: datetime.now(timezone('Europe/Moscow')))
    related_entity_link = Column(String, nullable=True)

    @staticmethod
    def create(description, type, related_entity_link=None):
        return Log(
            description=description,
            type=type,
            related_entity_link=related_entity_link
        )
