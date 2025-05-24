from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

class InventoryCondition(str, Enum):
    NORMAL = "NORMAL"
    REQUIRES_REPAIR = "REQUIRES_REPAIR"
    WRITTEN_OFF = "WRITTEN_OFF"

class UserBase(BaseModel):
    username: str
    email: str
    full_name: str
    phone_number: str
    is_admin: bool = False

class UserCreate(UserBase):
    password_hash: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    is_admin: Optional[bool] = None
    is_active: Optional[bool] = None
    avatar: Optional[bytes] = None

class UserResponse(UserBase):
    id: int
    registered_at: datetime
    deleted_at: Optional[datetime] = None
    is_active: bool
    avatar: Optional[bytes] = None

    class Config:
        orm_mode = True

class RoomBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class RoomResponse(RoomBase):
    id: int

    class Config:
        orm_mode = True

class InventoryCategoryBase(BaseModel):
    name: str
    short_name: str
    description: Optional[str] = None

class InventoryCategoryCreate(InventoryCategoryBase):
    pass

class InventoryCategoryResponse(InventoryCategoryBase):
    id: int

    class Config:
        orm_mode = True

class InventoryItemBase(BaseModel):
    inventory_number: str
    name: str
    description: Optional[str] = None
    category_id: int
    condition: InventoryCondition
    room_id: Optional[int] = None
    user_id: Optional[int] = None
    photo: Optional[bytes] = None
    purchase_date: Optional[datetime] = None
    purchase_price: Optional[float] = None
    warranty_until: Optional[datetime] = None

class InventoryItemCreate(BaseModel):
    name: str
    category_id: int
    inventory_number: Optional[str] = None
    description: Optional[str] = None
    condition: Optional[InventoryCondition] = InventoryCondition.NORMAL
    room_id: Optional[int] = None
    user_id: Optional[int] = None
    photo: Optional[bytes] = None
    purchase_date: Optional[datetime] = None
    purchase_price: Optional[float] = None
    warranty_until: Optional[datetime] = None

class InventoryItemUpdate(BaseModel):
    inventory_number: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    condition: Optional[InventoryCondition] = None
    room_id: Optional[int] = None
    user_id: Optional[int] = None
    photo: Optional[bytes] = None
    purchase_date: Optional[datetime] = None
    purchase_price: Optional[float] = None
    warranty_until: Optional[datetime] = None
    is_written_off: Optional[bool] = None

class InventoryItemResponse(InventoryItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_written_off: bool = False
    category_name: str
    room_name: Optional[str] = None

    class Config:
        orm_mode = True


class InventoryItemResponseForDetails(InventoryItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_written_off: bool = False
    category_name: str  # Добавляем название категории
    room_name: Optional[str] = None  # Добавляем название помещения

    class Config:
        from_attributes = True  # Для Pydantic v2 (бывшее orm_mode)

class ConsumableBase(BaseModel):
    name: str
    description: Optional[str] = None
    quantity: int = 0
    min_quantity: int = 1
    unit: str = 'шт.'

class ConsumableCreate(ConsumableBase):
    pass

class ConsumableUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[int] = None
    min_quantity: Optional[int] = None
    unit: Optional[str] = None

class ConsumableResponse(ConsumableBase):
    id: int

    class Config:
        orm_mode = True

class LogResponse(BaseModel):
    id: int
    description: str
    type: int
    created_at: datetime
    related_entity_link: Optional[str] = None
    user_id: Optional[int] = None

    class Config:
        orm_mode = True

class ReportType(str, Enum):
    USERS = "users"
    ROOMS = "rooms"
    INVENTORY_CATEGORIES = "inventory_categories"
    INVENTORY_ITEMS = "inventory_items"
    CONSUMABLES = "consumables"
    LOGS = "logs"
    LOW_STOCK = "low_stock"
    INVENTORY_BY_CONDITION = "inventory_by_condition"


class AuthResponse(BaseModel):
    is_admin: bool
    user_id: int
    full_name: str

class LoginRequest(BaseModel):
    username: str
    password: str