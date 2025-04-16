from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, DECIMAL, LargeBinary
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
    registered_at = Column(DateTime(timezone=True), nullable=False,
                           default=lambda: datetime.now(timezone('Europe/Moscow')))
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    is_admin = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)
    avatar = Column(LargeBinary, nullable=True)

    assigned_items = relationship("InventoryItem", back_populates="assigned_user")
    logs = relationship("Log", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"


class Room(Base):
    __tablename__ = 'rooms'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    short_name = Column(String(10), nullable=False, unique=True)

    items = relationship("InventoryItem", back_populates="room")

    def __repr__(self):
        return f"<Room(id={self.id}, name='{self.name}')>"


class InventoryCondition(Base):
    __tablename__ = 'inventory_conditions'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    description = Column(String, nullable=True)

    items = relationship("InventoryItem", back_populates="condition")

    def __repr__(self):
        return f"<InventoryCondition(id={self.id}, name='{self.name}')>"


class InventoryCategory(Base):
    __tablename__ = 'inventory_categories'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    short_name = Column(String(10), nullable=False, unique=True)
    description = Column(String, nullable=True)

    items = relationship("InventoryItem", back_populates="category")

    def __repr__(self):
        return f"<InventoryCategory(id={self.id}, name='{self.name}')>"


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
    category_id = Column(Integer, ForeignKey('inventory_categories.id'), nullable=False)
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

    def __repr__(self):
        return f"<InventoryItem(id={self.id}, number='{self.number}')>"


class Log(Base):
    __tablename__ = 'logs'

    id = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)
    type = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False,
                        default=lambda: datetime.now(timezone('Europe/Moscow')))
    related_entity_link = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)

    user = relationship("User", back_populates="logs")

    def __repr__(self):
        return f"<Log(id={self.id}, type={self.type})>"