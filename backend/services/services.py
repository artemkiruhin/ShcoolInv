from datetime import datetime
from typing import Type

from backend.core.dtos import UserCreateDTO, UserDTO, UserUpdateDTO, RoomDTO, InventoryConditionDTO, InventoryCategoryDTO, \
    InventoryItemDTO, InventoryItemShortDTO, InventoryItemCreateDTO, InventoryItemUpdateDTO, LogType, LogDTO, LoginDTO
from backend.core.entities import User, Room, InventoryCondition, InventoryCategory, InventoryItem, Log
from backend.core.repositories import UserRepository, RoomRepository, InventoryConditionRepository, InventoryCategoryRepository, \
 \
    InventoryItemRepository, LogRepository
from backend.services.security import create_jwt_token


class UserService:

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def create(self, request: UserCreateDTO) -> UserDTO | None:
        if not request: return None
        if not request.username or not request.password_hash or not request.email or not request.phone_number or not request.full_name or not request.is_admin:
            return None

        db_user = self.user_repository.get_by_all_args(request.username,
                                                       request.email,
                                                       request.full_name,
                                                       request.phone_number)
        if db_user: return None

        new_user = User.create(request.username,
                               request.password_hash,
                               request.email,
                               request.full_name,
                               request.phone_number,
                               request.is_admin,
                               request.avatar)

        return self.user_repository.create(new_user)

    def update(self, request: UserUpdateDTO) -> bool:
        if not request: return False
        if not request.username and not request.email and not request.phone_number and not request.full_name:
            return False

        db_user = self.user_repository.get_by_all_args(request.username,
                                                       request.email,
                                                       request.full_name,
                                                       request.phone_number)
        if not db_user: return False

        if request.username: db_user.username = request.username
        if request.email: db_user.email = request.email
        if request.phone_number: db_user.phone_number = request.phone_number
        if request.full_name: db_user.full_name = request.full_name

        return True if self.user_repository.update(db_user) is not None else False

    def delete(self, user_id, is_strong=False) -> bool | None:
        user = self.user_repository.get_by_id(user_id)
        if not user: return None

        if is_strong:
            user.deleted_at = datetime.now()
            user.is_active = False
            return self.user_repository.update(user) is not None

        return self.user_repository.delete(user_id)

    def get_all(self) -> list[Type[UserDTO]]:
        users = self.user_repository.get_all()
        user_dtos = [UserDTO]
        for user in users:
            dto = User.__map_to_dto(user)
            user_dtos.append(dto)

        return user_dtos

    def get_by_id(self, user_id) -> UserDTO | None:
        user = self.user_repository.get_by_id(user_id)
        if not user: return None

        dto = self.map_to_dto(user)
        return dto

    def login(self, username, password_hash) -> LoginDTO | None:
        user = self.user_repository.get_by_credentials(username, password_hash)
        if not user: return None
        jwt_token = create_jwt_token({
            "user_id": user.id,
            "is_admin": user.is_admin
        })

        result = LoginDTO(jwt_token, UserService.map_to_dto(user))
        return result

    def change_password_as_admin(self, sender_id, user_id, new_password_hash) -> bool:
        sender = self.user_repository.get_by_id(sender_id)
        if not sender or sender.is_admin is False: return False

        user = self.user_repository.get_by_id(user_id)
        if not user: return False

        user.password_hash = new_password_hash
        result = self.user_repository.update(user)
        return True if result is not None else False

    def change_password(self, user_id, old_password_hash, new_password_hash) -> bool:
        user = self.user_repository.get_by_id(user_id)
        if not user: return False
        if user.password_hash == old_password_hash or old_password_hash == new_password_hash: return False

        user.password_hash = new_password_hash
        result = self.user_repository.update(user)
        return True if result is not None else False

    def change_role(self, user_id, is_admin) -> bool:
        user = self.user_repository.get_by_id(user_id)
        if not user: return False

        user.is_admin = is_admin
        result = self.user_repository.update(user)
        return True if result is not None else False

    def get_by_username(self, username, is_strong=False) -> UserDTO | None:
        user = self.user_repository.get_by_username(username, is_strong)
        if not user: return None
        dto = self.map_to_dto(user)
        return dto

    def get_by_email(self, email, is_strong: bool = False) -> UserDTO | None:
        user = self.user_repository.get_by_email(email, is_strong)
        if not user: return None
        dto = self.map_to_dto(user)
        return dto

    def get_by_phone(self, phone_number) -> UserDTO | None:
        user = self.user_repository.get_by_all_args(None, None, None, phone_number)
        if not user: return None
        dto = self.map_to_dto(user)
        return dto

    def change_avatar(self, user_id: int, avatar=None) -> bool:
        user = self.user_repository.get_by_id(user_id)
        if not user: return False

        user.avatar = avatar
        result = self.user_repository.update(user)
        return True if result is not None else False

    @staticmethod
    def map_to_dto(entity: User):
        dto = UserDTO(entity.id,
                      entity.username,
                      entity.email,
                      entity.full_name,
                      entity.phone_number,
                      entity.registered_at,
                      entity.deleted_at,
                      entity.is_admin,
                      entity.is_active,
                      entity.avatar)
        return dto


class RoomService:

    def __init__(self, room_repository: RoomRepository):
        self.room_repository = room_repository

    def create(self, name, short_name) -> int | None:
        room = self.room_repository.get_by_name(name)
        if not room: return None
        new_room = Room.create(name, short_name)
        result = self.room_repository.create(new_room).id
        return result

    def update(self, room_id, name) -> int | None:
        room = self.room_repository.get_by_id(room_id)
        if not room: return None

        room_by_name = self.room_repository.get_by_name(name)
        if room_by_name: return None

        room.name = name
        result = self.room_repository.update(room).id
        return result

    def delete(self, room_id) -> bool:
        room = self.room_repository.get_by_id(room_id)
        if not room: return False
        return self.room_repository.delete(room)

    def get_all(self) -> list[RoomDTO]:
        rooms = self.room_repository.get_all()
        room_dtos = [RoomDTO]
        for room in rooms: room_dtos.append(self.map_to_dto(room))
        return room_dtos

    def get_by_id(self, room_id):
        room = self.room_repository.get_by_id(room_id)
        room_dto = self.map_to_dto(room)
        return room_dto

    def get_by_name(self, name):
        room = self.room_repository.get_by_name(name)
        room_dto = self.map_to_dto(room)
        return room_dto

    @staticmethod
    def map_to_dto(entity: Room):
        return RoomDTO(entity.id, entity.name, entity.short_name)


class InventoryConditionService:
    def __init__(self, inventory_condition_repository: InventoryConditionRepository):
        self.inventory_condition_repository = inventory_condition_repository

    def create(self, name, description) -> int | None:
        condition = self.inventory_condition_repository.get_by_name(name)
        if condition: return None
        new_condition = InventoryCondition.create(name, description)
        return self.inventory_condition_repository.create(new_condition).id

    def update(self, condition_id, name: str = None, description: str = None) -> int | None:
        if not name and not description: return None
        condition = self.inventory_condition_repository.get_by_id(condition_id)
        if not condition: return None
        if name: condition.name = name
        if description: condition.description = description
        return self.inventory_condition_repository.update(condition).id

    def delete(self, condition_id, is_strong=False) -> bool:
        condition = self.inventory_condition_repository.get_by_id(condition_id)
        if not condition: return False
        return self.inventory_condition_repository.delete(condition)

    def get_all(self) -> list[InventoryConditionDTO]:
        conditions = self.inventory_condition_repository.get_all()
        condition_dtos = [InventoryConditionDTO]
        for condition in conditions: condition_dtos.append(self.map_to_dto(condition))
        return condition_dtos

    def get_by_id(self, condition_id) -> InventoryConditionDTO | None:
        condition = self.inventory_condition_repository.get_by_id(condition_id)
        if not condition: return None
        return self.map_to_dto(condition)

    def get_by_name(self, name) -> InventoryConditionDTO | None:
        condition = self.inventory_condition_repository.get_by_name(name)
        if not condition: return None
        return self.map_to_dto(condition)

    @staticmethod
    def map_to_dto(condition: InventoryCondition):
        return InventoryConditionDTO(condition.id, condition.name, condition.description)



class InventoryCategoryService:
    def __init__(self, inventory_category_repository: InventoryCategoryRepository):
        self.inventory_category_repository = inventory_category_repository

    def create(self, name, short_name, description) -> int | None:
        category = self.inventory_category_repository.get_by_name(name)
        if category: return None
        new_category = InventoryCategory.create(name, short_name, description)
        return self.inventory_category_repository.create(new_category).id

    def update(self, condition_id, name: str = None, short_name: str = None, description: str = None) -> int | None:
        if not name and not description and not short_name: return None
        category = self.inventory_category_repository.get_by_id(condition_id)
        if not category: return None
        if name: category.name = name
        if short_name: category.short_name = short_name
        if description: category.description = description
        return self.inventory_category_repository.update(category).id

    def delete(self, condition_id, is_strong=False) -> bool:
        category = self.inventory_category_repository.get_by_id(condition_id)
        if not category: return False
        return self.inventory_category_repository.delete(category)

    def get_all(self) -> list[InventoryCategoryDTO]:
        categories = self.inventory_category_repository.get_all()
        category_dtos = [InventoryConditionDTO]
        for category in categories: category_dtos.append(self.map_to_dto(category))
        return category_dtos

    def get_by_id(self, condition_id) -> InventoryCategoryDTO | None:
        category = self.inventory_category_repository.get_by_id(condition_id)
        if not category: return None
        return self.map_to_dto(category)

    def get_by_name(self, name) -> InventoryCategoryDTO | None:
        category = self.inventory_category_repository.get_by_name(name)
        if not category: return None
        return self.map_to_dto(category)

    @staticmethod
    def map_to_dto(category: InventoryCategory):
        return InventoryCategoryDTO(category.id, category.name, category.short_name, category.description)


class InventoryItemService:
    def __init__(self,
                 inventory_item_repository: InventoryItemRepository,
                 condition_repository: InventoryConditionRepository,
                 category_repository: InventoryCategoryRepository,
                 room_repository: RoomRepository):
        self.inventory_item_repository = inventory_item_repository
        self.condition_repository = condition_repository
        self.category_repository = category_repository
        self.room_repository = room_repository

    def generate_number(self, item_id: int, category_id: int, room_id: int) -> str | None:
        item = self.inventory_item_repository.get_by_id(item_id)
        category = self.category_repository.get_by_id(category_id)
        room = self.room_repository.get_by_id(room_id)

        if not item or not category or not room: return None

        return f'{category.short_name.upper()} - {room.short_name.upper()} - {item_id:05d}'

    def create(self, request: InventoryItemCreateDTO) -> int | None:
        item = self.inventory_item_repository.search({"name": request.name})[0]
        if item: return None
        new_item = InventoryItem.create(
            None,
            request.name,
            request.description,
            request.category_id,
            request.room_id,
            request.assigned_user_id,
            request.photo,
            request.purchase_date,
            request.purchase_price,
            request.warranty_until
        )
        created_item = self.inventory_item_repository.create(new_item)
        if not created_item: return None

        created_item.number = self.generate_number(created_item.id, created_item.category_id, created_item.room_id)
        result = self.inventory_item_repository.update(created_item)
        return result.id if result is not None else None

    def update(self, request: InventoryItemUpdateDTO) -> bool:
        if not any([
            request.name,
            request.description,
            request.category_id,
            request.room_id,
            request.condition_id,
            request.assigned_user_id,
            request.photo is not None,
            request.purchase_date,
            request.purchase_price,
            request.warranty_until,
            request.is_written_off is not None
        ]):
            return False

        item = self.inventory_item_repository.get_by_id(request.item_id)
        if not item: return False

        needs_number_update = False

        if request.name: item.name = request.name
        if request.description: item.description = request.description
        if request.condition_id: item.condition_id = request.condition_id
        if request.assigned_user_id: item.assigned_user_id = request.assigned_user_id
        if request.photo is not None: item.photo = request.photo
        if request.purchase_date: item.purchase_date = request.purchase_date
        if request.purchase_price: item.purchase_price = request.purchase_price
        if request.warranty_until: item.warranty_until = request.warranty_until
        if request.is_written_off is not None: item.is_written_off = request.is_written_off
        if request.category_id and request.category_id != item.category_id:
            item.category_id = request.category_id
            needs_number_update = True
        if request.room_id and request.room_id != item.room_id:
            item.room_id = request.room_id
            needs_number_update = True
        if needs_number_update:
            category = self.category_repository.get_by_id(item.category_id)
            room = self.room_repository.get_by_id(item.room_id)

            if category and room:
                item.number = self.generate_number(
                    item_id=item.id,
                    category_short_name=category.short_name,
                    room_short_name=room.short_name
                )

        item.updated_at = datetime.now()
        updated_item = self.inventory_item_repository.update(item)
        return updated_item is not None

    def delete(self, item_id: int, is_strong: bool = True) -> bool:
        item = self.inventory_item_repository.get_by_id(item_id)
        if not item: return False
        return self.inventory_item_repository.delete(item)

    def get_all(self, is_short: bool) -> list[InventoryItemDTO] | list[InventoryItemShortDTO]:
        items = self.inventory_item_repository.get_all()
        item_dtos = []
        for item in items: item_dtos.append(self.__map_to_dto(item, is_short))
        return item_dtos

    def get_by_id(self, item_id: int, is_short: bool = True):
        item = self.inventory_item_repository.get_by_id(item_id)
        if not item: return None
        return self.__map_to_dto(item, is_short)

    def get_by_number(self, number, is_short: bool = True):
        item = self.inventory_item_repository.get_by_number(number)
        if not item: return None
        return self.__map_to_dto(item, is_short)

    def get_by_category(self, category_id, is_short: bool = True):
        item = self.inventory_item_repository.get_by_category(category_id)
        if not item: return None
        return self.__map_to_dto(item, is_short)

    def get_by_room(self, room_id, is_short: bool = True):
        item = self.inventory_item_repository.get_by_room(room_id)
        if not item: return None
        return self.__map_to_dto(item, is_short)


    @staticmethod
    def __map_to_dto(inventory_item: InventoryItem, is_short: bool = True):
        return InventoryItemDTO(
            inventory_item.id,
            inventory_item.number,
            inventory_item.name,
            inventory_item.description,
            inventory_item.created_at,
            InventoryConditionService.map_to_dto(inventory_item.condition),
            InventoryCategoryService.map_to_dto(inventory_item.category),
            UserService.map_to_dto(inventory_item.assigned_user),
            inventory_item.is_written_off,
            inventory_item.updated_at,
            RoomService.map_to_dto(inventory_item.room),
            inventory_item.photo,
            inventory_item.purchase_date,
            inventory_item.purchase_price,
            inventory_item.warranty_until
        ) if is_short else InventoryItemShortDTO(
            inventory_item.id,
            inventory_item.number,
            inventory_item.name,
            InventoryCategoryService.map_to_dto(inventory_item.category),
            InventoryConditionService.map_to_dto(inventory_item.condition),
            RoomService.map_to_dto(inventory_item.room)
        )


class LogService:
    def __init__(self, log_repository: LogRepository):
        self.log_repository = log_repository

    def create(self, description: str, log_type: LogType, related_entity_link: str = None):
        new_log = Log.create(description, log_type, related_entity_link)
        return self.log_repository.create(new_log) is not None

    def delete(self, log_id: int, is_strong: bool = False):
        log = self.log_repository.get_by_id(log_id)
        if not log: return False
        return self.log_repository.delete(log)

    def get_all(self) -> [LogDTO]:
        logs = self.log_repository.get_all()
        log_dtos = [LogDTO]
        for log in logs:
            log_dtos.append(LogService.map_to_dto(log))
        return log_dtos

    def get_by_id(self, log_id: int):
        log = self.log_repository.get_by_id(log_id)
        return LogService.map_to_dto(log)

    def get_by_status(self, status: LogType):
        logs = self.log_repository.get_by_status(status)
        log_dtos = [LogDTO]
        for log in logs:
            log_dtos.append(LogService.map_to_dto(log))
        return log_dtos

    @staticmethod
    def map_to_dto(log: Log):
        return LogDTO(
            log.id,
            log.description,
            log.type,
            log.created_at,
            log.related_entity_link
        )
