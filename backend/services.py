from datetime import datetime
from typing import List, Optional, Dict
import logging
from dtos import *
from entities import *
from repositories import *

logger = logging.getLogger(__name__)


class UserService:
    def __init__(self, user_repository: UserRepository):
        self.repo = user_repository

    def create_user(self, user_data: Dict) -> Optional[UserDTO]:
        try:
            if self.repo.get_by_username(user_data['username']):
                logger.warning(f"Username {user_data['username']} already exists")
                return None

            if self.repo.get_by_email(user_data['email']):
                logger.warning(f"Email {user_data['email']} already exists")
                return None

            new_user = User(**user_data)
            created_user = self.repo.create(new_user)
            return UserDTO.model_validate(created_user)
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            return None

    def authenticate(self, username: str, password_hash: str) -> Optional[UserDTO]:
        user = self.repo.get_by_credentials(username, password_hash)
        return UserDTO.model_validate(user) if user else None

    def get_user(self, user_id: int) -> Optional[UserDTO]:
        user = self.repo.get_by_id(user_id)
        return UserDTO.model_validate(user) if user else None

    def update_user(self, user_id: int, update_data: Dict) -> Optional[UserDTO]:
        user = self.repo.get_by_id(user_id)
        if not user:
            return None

        for key, value in update_data.items():
            setattr(user, key, value)

        updated_user = self.repo.update(user)
        return UserDTO.model_validate(updated_user)

    def delete_user(self, user_id: int) -> bool:
        return self.repo.delete(user_id)

    def list_users(self) -> List[UserDTO]:
        users = self.repo.get_all()
        return [UserDTO.model_validate(user) for user in users]


class RoomService:
    def __init__(self, room_repository: RoomRepository):
        self.repo = room_repository

    def create_room(self, name: str, short_name: str) -> Optional[RoomDTO]:
        try:
            if self.repo.get_by_name(name):
                logger.warning(f"Room {name} already exists")
                return None

            new_room = Room(name=name, short_name=short_name)
            created_room = self.repo.create(new_room)
            return RoomDTO.model_validate(created_room)
        except Exception as e:
            logger.error(f"Error creating room: {str(e)}")
            return None

    def get_room(self, room_id: int) -> Optional[RoomDTO]:
        room = self.repo.get_by_id(room_id)
        return RoomDTO.model_validate(room) if room else None

    def list_rooms(self) -> List[RoomDTO]:
        rooms = self.repo.get_all()
        return [RoomDTO.model_validate(room) for room in rooms]


class InventoryItemService:
    def __init__(self,
                 item_repo: InventoryItemRepository,
                 category_repo: InventoryCategoryRepository,
                 room_repo: RoomRepository):
        self.item_repo = item_repo
        self.category_repo = category_repo
        self.room_repo = room_repo

    def generate_inventory_number(self, category_id: int, room_id: Optional[int] = None) -> str:
        category = self.category_repo.get_by_id(category_id)
        if not category:
            raise ValueError("Category not found")

        room_short = "GEN"  # Для предметов без кабинета
        if room_id:
            room = self.room_repo.get_by_id(room_id)
            if room:
                room_short = room.short_name.upper()[:3]

        cat_short = category.short_name.upper()[:3]

        last_item = self.item_repo.get_last_by_category_and_room(category_id, room_id)
        next_num = 1
        if last_item and last_item.number:
            try:
                last_num = int(last_item.number.split('-')[-1])
                next_num = last_num + 1
            except (IndexError, ValueError):
                pass

        return f"{cat_short}-{room_short}-{next_num:06d}"

    def create_item(self, item_data: Dict) -> Optional[InventoryItemDTO]:
        try:
            if 'number' not in item_data or not item_data['number']:
                item_data['number'] = self.generate_inventory_number(
                    item_data['category_id'],
                    item_data.get('room_id')
                )

            new_item = InventoryItem(**item_data)
            created_item = self.item_repo.create(new_item)
            return InventoryItemDTO.model_validate(created_item)
        except Exception as e:
            logger.error(f"Error creating inventory item: {str(e)}")
            return None

    def get_item(self, item_id: int) -> Optional[InventoryItemDTO]:
        item = self.item_repo.get_by_id(item_id)
        return InventoryItemDTO.model_validate(item) if item else None

    def search_items(self, filters: Dict) -> List[InventoryItemDTO]:
        items = self.item_repo.search(filters)
        return [InventoryItemDTO.model_validate(item) for item in items]

    def update_item(self, item_id: int, update_data: Dict) -> Optional[InventoryItemDTO]:
        item = self.item_repo.get_by_id(item_id)
        if not item:
            return None

        for key, value in update_data.items():
            setattr(item, key, value)

        updated_item = self.item_repo.update(item)
        return InventoryItemDTO.model_validate(updated_item)

    def delete_item(self, item_id: int) -> bool:
        return self.item_repo.delete(item_id)


class LogService:
    def __init__(self, log_repo: LogRepository):
        self.repo = log_repo

    def create_log(self, description: str, log_type: int, user_id: Optional[int] = None) -> Optional[LogDTO]:
        try:
            new_log = Log(
                description=description,
                type=log_type,
                user_id=user_id
            )
            created_log = self.repo.create(new_log)
            return LogDTO.model_validate(created_log)
        except Exception as e:
            logger.error(f"Error creating log: {str(e)}")
            return None

    def get_recent_logs(self, limit: int = 100) -> List[LogDTO]:
        logs = self.repo.get_recent(limit)
        return [LogDTO.model_validate(log) for log in logs]

    def get_user_logs(self, user_id: int, limit: int = 100) -> List[LogDTO]:
        logs = self.repo.get_by_user(user_id, limit)
        return [LogDTO.model_validate(log) for log in logs]