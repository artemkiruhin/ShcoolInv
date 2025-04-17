from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class UserDTO(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    phone_number: str
    registered_at: datetime
    deleted_at: Optional[datetime] = None
    is_admin: bool
    is_active: bool
    avatar: Optional[bytes] = None

    class Config:
        from_attributes = True

class RoomDTO(BaseModel):
    id: int
    name: str
    short_name: str

    class Config:
        from_attributes = True

class InventoryCategoryDTO(BaseModel):
    id: int
    name: str
    short_name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class InventoryConditionDTO(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class InventoryItemShortDTO(BaseModel):
    id: int
    number: str
    name: str
    category: str
    room: Optional[str] = None
    condition: str

    class Config:
        from_attributes = True

class InventoryItemDTO(BaseModel):
    id: int
    number: str
    name: str
    description: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    condition: InventoryConditionDTO
    category: InventoryCategoryDTO
    room: Optional[RoomDTO] = None
    assigned_user: UserDTO
    photo: Optional[bytes] = None
    purchase_date: Optional[datetime] = None
    purchase_price: Optional[float] = None
    warranty_until: Optional[datetime] = None
    is_written_off: bool

    class Config:
        from_attributes = True

class LogDTO(BaseModel):
    id: int
    description: str
    type: int
    created_at: datetime
    related_entity_link: Optional[str] = None
    user: Optional[UserDTO] = None

    class Config:
        from_attributes = True

class PaginatedResponse(BaseModel):
    items: List
    total: int
    page: int
    size: int

# Добавьте в dtos.py
class UserCreateDTO(BaseModel):
    username: str
    password: str
    email: str
    full_name: str
    phone_number: str
    is_admin: bool = False

class UserUpdateDTO(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: Optional[bool] = None
    avatar: Optional[bytes] = None

class RoomCreateDTO(BaseModel):
    name: str
    short_name: str

class InventoryItemCreateDTO(BaseModel):
    name: str
    description: str
    category_id: int
    room_id: Optional[int] = None
    condition_id: int
    photo: Optional[bytes] = None
    purchase_date: Optional[datetime] = None
    purchase_price: Optional[float] = None
    warranty_until: Optional[datetime] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class InventoryItemUpdateDTO(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    room_id: Optional[int] = None
    condition_id: Optional[int] = None
    assigned_user_id: Optional[int] = None
    photo: Optional[bytes] = None
    purchase_date: Optional[datetime] = None
    purchase_price: Optional[float] = None
    warranty_until: Optional[datetime] = None
    is_written_off: Optional[bool] = None