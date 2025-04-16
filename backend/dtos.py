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