import enum
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

    def __init__(
        self,
        id: int,
        username: str,
        email: str,
        full_name: str,
        phone_number: str,
        registered_at: datetime,
        deleted_at: Optional[datetime] = None,
        is_admin: bool = False,
        is_active: bool = True,
        avatar: Optional[bytes] = None,
    ):
        super().__init__(
            id=id,
            username=username,
            email=email,
            full_name=full_name,
            phone_number=phone_number,
            registered_at=registered_at,
            deleted_at=deleted_at,
            is_admin=is_admin,
            is_active=is_active,
            avatar=avatar,
        )

    class Config:
        from_attributes = True


class RoomDTO(BaseModel):
    id: int
    name: str
    short_name: str

    def __init__(self, id: int, name: str, short_name: str):
        super().__init__(id=id, name=name, short_name=short_name)

    class Config:
        from_attributes = True


class InventoryCategoryDTO(BaseModel):
    id: int
    name: str
    short_name: str
    description: Optional[str] = None

    def __init__(
        self,
        id: int,
        name: str,
        short_name: str,
        description: Optional[str] = None,
    ):
        super().__init__(
            id=id,
            name=name,
            short_name=short_name,
            description=description,
        )

    class Config:
        from_attributes = True


class InventoryConditionDTO(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    def __init__(
        self,
        id: int,
        name: str,
        description: Optional[str] = None,
    ):
        super().__init__(
            id=id,
            name=name,
            description=description,
        )

    class Config:
        from_attributes = True


class InventoryItemShortDTO(BaseModel):
    id: int
    number: str
    name: str
    category: InventoryCategoryDTO
    room: RoomDTO
    condition: InventoryConditionDTO

    def __init__(
        self,
        id: int,
        number: str,
        name: str,
        category: InventoryCategoryDTO,
        condition: InventoryConditionDTO,
        room: RoomDTO
    ):
        super().__init__(
            id=id,
            number=number,
            name=name,
            category=category,
            room=room,
            condition=condition,
        )

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

    def __init__(
        self,
        id: int,
        number: str,
        name: str,
        description: str,
        created_at: datetime,
        condition: InventoryConditionDTO,
        category: InventoryCategoryDTO,
        assigned_user: UserDTO,
        is_written_off: bool,
        updated_at: Optional[datetime] = None,
        room: Optional[RoomDTO] = None,
        photo: Optional[bytes] = None,
        purchase_date: Optional[datetime] = None,
        purchase_price: Optional[float] = None,
        warranty_until: Optional[datetime] = None,
    ):
        super().__init__(
            id=id,
            number=number,
            name=name,
            description=description,
            created_at=created_at,
            updated_at=updated_at,
            condition=condition,
            category=category,
            room=room,
            assigned_user=assigned_user,
            photo=photo,
            purchase_date=purchase_date,
            purchase_price=purchase_price,
            warranty_until=warranty_until,
            is_written_off=is_written_off,
        )

    class Config:
        from_attributes = True


class LogDTO(BaseModel):
    id: int
    description: str
    type: int
    created_at: datetime
    related_entity_link: Optional[str] = None

    def __init__(
        self,
        id: int,
        description: str,
        type: int,
        created_at: datetime,
        related_entity_link: Optional[str] = None
    ):
        super().__init__(
            id=id,
            description=description,
            type=type,
            created_at=created_at,
            related_entity_link=related_entity_link
        )

    class Config:
        from_attributes = True


class PaginatedResponse(BaseModel):
    items: List
    total: int
    page: int
    size: int

    def __init__(
        self,
        items: List,
        total: int,
        page: int,
        size: int,
    ):
        super().__init__(
            items=items,
            total=total,
            page=page,
            size=size,
        )


class UserCreateDTO(BaseModel):
    username: str
    password_hash: str
    email: str
    full_name: str
    phone_number: str
    is_admin: bool
    avatar: Optional[bytes] = None

    def __init__(
        self,
        username: str,
        password_hash: str,
        email: str,
        full_name: str,
        phone_number: str,
        is_admin: bool,
        avatar: Optional[bytes] = None,
    ):
        super().__init__(
            username=username,
            password_hash=password_hash,
            email=email,
            full_name=full_name,
            phone_number=phone_number,
            is_admin=is_admin,
            avatar=avatar,
        )


class UserUpdateDTO(BaseModel):
    username: str
    email: str
    full_name: str
    phone_number: str

    def __init__(
        self,
        username: str,
        email: str,
        full_name: str,
        phone_number: str,
    ):
        super().__init__(
            username=username,
            email=email,
            full_name=full_name,
            phone_number=phone_number,
        )


class RoomCreateDTO(BaseModel):
    name: str
    short_name: str

    def __init__(self, name: str, short_name: str):
        super().__init__(name=name, short_name=short_name)


class InventoryItemCreateDTO(BaseModel):
    name: str
    description: str
    category_id: int
    room_id: int
    assigned_user_id: int
    photo: Optional[bytes]
    purchase_date: Optional[datetime]
    purchase_price: Optional[float]
    warranty_until: Optional[datetime]

    def __init__(
        self,
            name: str,
            description: str,
            category_id: int,
            room_id: int,
            assigned_user_id: int,
            photo: Optional[bytes] = None,
            purchase_date: Optional[datetime] = None,
            purchase_price: Optional[float] = None,
            warranty_until: Optional[datetime] = None
    ):
        super().__init__(
            name=name,
            description=description,
            category_id=category_id,
            room_id=room_id,
            assigned_user_id=assigned_user_id,
            photo=photo,
            purchase_date=purchase_date,
            purchase_price=purchase_price,
            warranty_until=warranty_until
        )


class Token(BaseModel):
    access_token: str
    token_type: str

    def __init__(self, access_token: str, token_type: str):
        super().__init__(access_token=access_token, token_type=token_type)


class InventoryItemUpdateDTO(BaseModel):
    item_id: int
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

    def __init__(
        self,
            item_id: int,
            name: Optional[str] = None,
            description: Optional[str] = None,
            category_id: Optional[int] = None,
            room_id: Optional[int] = None,
            condition_id: Optional[int] = None,
            assigned_user_id: Optional[int] = None,
            photo: Optional[bytes] = None,
            purchase_date: Optional[datetime] = None,
            purchase_price: Optional[float] = None,
            warranty_until: Optional[datetime] = None,
            is_written_off: Optional[bool] = None
    ):
        super().__init__(
            name=name,
            description=description,
            category_id=category_id,
            room_id=room_id,
            condition_id=condition_id,
            assigned_user_id=assigned_user_id,
            photo=photo,
            purchase_date=purchase_date,
            purchase_price=purchase_price,
            warranty_until=warranty_until,
            is_written_off=is_written_off
        )

class LogType(enum.Enum):
    Info = 1
    Warning = 2
    Error = 3
