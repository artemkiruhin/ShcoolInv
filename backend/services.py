from datetime import datetime
from typing import Type, List

from dtos import UserCreateDTO, UserDTO, UserUpdateDTO, RoomDTO, InventoryConditionDTO, InventoryCategoryDTO
from entities import User, Room, InventoryCondition, InventoryCategory
from repositories import UserRepository, RoomRepository, InventoryConditionRepository, InventoryCategoryRepository, \
 \
    InventoryItemRepository, LogRepository
from security import create_jwt_token


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

        dto = self.__map_to_dto(user)
        return dto

    def login(self, username, password_hash) -> str | None:
        user = self.user_repository.get_by_credentials(username, password_hash)
        if not user: return None
        jwt_token = create_jwt_token({
            "user_id": user.id,
            "is_admin": user.is_admin
        })

        return jwt_token

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
        dto = self.__map_to_dto(user)
        return dto

    def get_by_email(self, email, is_strong: bool = False) -> UserDTO | None:
        user = self.user_repository.get_by_email(email, is_strong)
        if not user: return None
        dto = self.__map_to_dto(user)
        return dto

    def get_by_phone(self, phone_number) -> UserDTO | None:
        user = self.user_repository.get_by_all_args(None, None, None, phone_number)
        if not user: return None
        dto = self.__map_to_dto(user)
        return dto

    def change_avatar(self, user_id: int, avatar=None) -> bool:
        user = self.user_repository.get_by_id(user_id)
        if not user: return False

        user.avatar = avatar
        result = self.user_repository.update(user)
        return True if result is not None else False

    @staticmethod
    def __map_to_dto(entity: User):
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
        for room in rooms: room_dtos.append(self.__map_to_dto(room))
        return room_dtos

    def get_by_id(self, room_id):
        room = self.room_repository.get_by_id(room_id)
        room_dto = self.__map_to_dto(room)
        return room_dto

    def get_by_name(self, name):
        room = self.room_repository.get_by_name(name)
        room_dto = self.__map_to_dto(room)
        return room_dto

    @staticmethod
    def __map_to_dto(entity: Room):
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
        for condition in conditions: condition_dtos.append(self.__map_to_dto(condition))
        return condition_dtos

    def get_by_id(self, condition_id) -> InventoryConditionDTO | None:
        condition = self.inventory_condition_repository.get_by_id(condition_id)
        if not condition: return None
        return self.__map_to_dto(condition)

    def get_by_name(self, name) -> InventoryConditionDTO | None:
        condition = self.inventory_condition_repository.get_by_name(name)
        if not condition: return None
        return self.__map_to_dto(condition)

    @staticmethod
    def __map_to_dto(condition: InventoryCondition):
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
        for category in categories: category_dtos.append(self.__map_to_dto(category))
        return category_dtos

    def get_by_id(self, condition_id) -> InventoryCategoryDTO | None:
        category = self.inventory_category_repository.get_by_id(condition_id)
        if not category: return None
        return self.__map_to_dto(category)

    def get_by_name(self, name) -> InventoryCategoryDTO | None:
        category = self.inventory_category_repository.get_by_name(name)
        if not category: return None
        return self.__map_to_dto(category)

    @staticmethod
    def __map_to_dto(category: InventoryCategory):
        return InventoryCategoryDTO(category.id, category.name, category.short_name, category.description)
