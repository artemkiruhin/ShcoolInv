from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, DECIMAL, LargeBinary
from sqlalchemy.orm import relationship
from backend.configurations.config import Base
from datetime import datetime
from pytz import timezone

class User(Base):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}

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
    avatar = Column(LargeBinary, nullable=True)

    assigned_items = relationship("InventoryItem", back_populates="assigned_user")

class Room(Base):
    __tablename__ = 'rooms'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    short_name = Column(String(10), nullable=False, unique=True)

    items = relationship("InventoryItem", back_populates="room")

class InventoryCondition(Base):
    __tablename__ = 'inventory_conditions'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    description = Column(String, nullable=True)

    items = relationship("InventoryItem", back_populates="condition")

class InventoryCategory(Base):
    __tablename__ = 'inventory_category'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    short_name = Column(String(10), nullable=False, unique=True)
    description = Column(String, nullable=True)

    items = relationship("InventoryItem", back_populates="category")

class InventoryItem(Base):
    __module__ = 'backend.core.entities'
    __tablename__ = 'inventory_items'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    number = Column(String(50), nullable=True, unique=True)
    name = Column(String(50), nullable=False)
    description = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False,
                      default=lambda: datetime.now(timezone('Europe/Moscow')))
    updated_at = Column(DateTime(timezone=True), nullable=True)

    condition_id = Column(Integer, ForeignKey('inventory_conditions.id'), nullable=False)
    category_id = Column(Integer, ForeignKey('inventory_category.id'), nullable=False)
    room_id = Column(Integer, ForeignKey('rooms.id'), nullable=True)
    assigned_user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    photo = Column(LargeBinary, nullable=True)
    purchase_date = Column(DateTime(timezone=True), nullable=True)
    purchase_price = Column(DECIMAL, nullable=True)
    warranty_until = Column(DateTime(timezone=True), nullable=False)
    is_written_off = Column(Boolean, nullable=False, default=False)

    condition = relationship("InventoryCondition", back_populates="items")
    category = relationship("InventoryCategory", back_populates="items")
    room = relationship("Room", back_populates="items")
    assigned_user = relationship("User", back_populates="assigned_items")

class Log(Base):
    __tablename__ = 'logs'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)
    type = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False,
                  default=lambda: datetime.now(timezone('Europe/Moscow')))
    related_entity_link = Column(String, nullable=True)