from repositories import UserRepository, RoomRepository, InventoryConditionRepository, InventoryCategoryRepository, \
    InventoryItemRepository, LogRepository


class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def create(self, username, password_hash, email, full_name, phone_number, is_admin, avatar = None):
        raise NotImplemented

    def update(self, username, email, full_name, phone_number):
        raise NotImplemented

    def delete(self, user_id, is_strong = False):
        raise NotImplemented

    def get_all(self):
        raise NotImplemented

    def get_by_id(self, user_id):
        raise NotImplemented

    def login(self, username, password_hash):
        raise NotImplemented

    def change_password_as_admin(self, user_id, new_password):
        raise NotImplemented

    def change_password(self, user_id, old_password, new_password):
        raise NotImplemented

    def change_role(self, user_id, is_admin):
        raise NotImplemented

    def get_by_username(self, username, is_strong = False):
        raise NotImplemented

    def get_by_full_name(self, full_name, is_strong = False):
        raise NotImplemented

    def get_by_email(self, email, is_strong: bool = False):
        raise NotImplemented

    def get_by_phone(self, phone_number, is_strong: bool = False):
        raise NotImplemented

    def change_avatar(self, avatar = None):
        raise NotImplemented



class RoomService:
    def __init__(self, room_repository: RoomRepository):
        self.room_repository = room_repository

    def create(self, name):
        raise NotImplemented

    def update(self, name):
        raise NotImplemented

    def delete(self, room_id, is_strong=False):
        raise NotImplemented

    def get_all(self):
        raise NotImplemented

    def get_by_id(self, room_id):
        raise NotImplemented

    def get_by_name(self, name, is_strong=False):
        raise NotImplemented



class InventoryConditionService:
    def __init__(self, inventory_condition_repository: InventoryConditionRepository):
        self.inventory_condition_repository = inventory_condition_repository

    def create(self, name, description):
        raise NotImplemented

    def update(self, name, description):
        raise NotImplemented

    def delete(self, condition_id, is_strong=False):
        raise NotImplemented

    def get_all(self):
        raise NotImplemented

    def get_by_id(self, condition_id):
        raise NotImplemented

    def get_by_name(self, name, is_strong=False):
        raise NotImplemented



class InventoryCategoryService:
    def __init__(self, inventory_category_repository: InventoryCategoryRepository):
        self.inventory_category_repository = inventory_category_repository

    def create(self, name, description):
        raise NotImplemented

    def update(self, name, description):
        raise NotImplemented

    def delete(self, category_id, is_strong=False):
        raise NotImplemented

    def get_all(self):
        raise NotImplemented

    def get_by_id(self, category_id):
        raise NotImplemented

    def get_by_name(self, name, is_strong=False):
        raise NotImplemented



class InventoryItemService:
    def __init__(self, inventory_item_repository: InventoryItemRepository):
        self.inventory_item_repository = inventory_item_repository

    def create(self, name, description, category_id, room_id, assigned_user_id, photo=None, purchase_date=None, purchase_price=None, warranty_until=None):
        raise NotImplemented

    def update(self, name, description, category_id, room_id, assigned_user_id, photo, purchase_date, purchase_price, warranty_until):
        raise NotImplemented

    def delete(self, item_id, is_strong=False):
        raise NotImplemented

    def get_all(self):
        raise NotImplemented

    def get_by_id(self, item_id):
        raise NotImplemented

    def get_by_number(self, number, is_strong):
        raise NotImplemented

    def get_by_name(self, name, is_strong):
        raise NotImplemented

    def get_by_category(self, category_id, is_strong):
        raise NotImplemented

    def get_by_room(self, room_id, is_strong):
        raise NotImplemented

    def get_by_assigned_user(self, assigned_user_id, is_strong):
        raise NotImplemented

    def get_by_price(self, price_from, price_to):
        raise NotImplemented



class LogService:
    def __init__(self, log_repository: LogRepository):
        self.log_repository = log_repository

    def create(self, description, type, related_entity_link=None):
        raise NotImplemented

    def delete(self, log_id, is_strong=False):
        raise NotImplemented

    def get_all(self):
        raise NotImplemented

    def get_by_id(self, log_id):
        raise NotImplemented

    def get_by_status(self, status):
        raise NotImplemented

    def get_by_user(self, user_id):
        raise NotImplemented
