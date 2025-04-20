from dependency_injector import containers, providers
from core.repositories import (
    UserRepository,
    RoomRepository,
    InventoryItemRepository,
    InventoryCategoryRepository,
    InventoryConditionRepository,
    LogRepository
)
from services.services import (
    UserService,
    RoomService,
    InventoryItemService,
    InventoryCategoryService,
    InventoryConditionService,
    LogService
)
from config import SessionLocal


class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        modules=[
            "main"
        ]
    )

    db_session = providers.Singleton(SessionLocal)

    user_repository = providers.Factory(
        UserRepository,
        session=db_session
    )

    room_repository = providers.Factory(
        RoomRepository,
        session=db_session
    )

    inventory_item_repository = providers.Factory(
        InventoryItemRepository,
        session=db_session
    )

    inventory_category_repository = providers.Factory(
        InventoryCategoryRepository,
        session=db_session
    )

    inventory_condition_repository = providers.Factory(
        InventoryConditionRepository,
        session=db_session
    )

    log_repository = providers.Factory(
        LogRepository,
        session=db_session
    )

    user_service = providers.Factory(
        UserService,
        user_repository=user_repository
    )

    room_service = providers.Factory(
        RoomService,
        room_repository=room_repository
    )

    inventory_item_service = providers.Factory(
        InventoryItemService,
        inventory_item_repository=inventory_item_repository,
        condition_repository=inventory_condition_repository,
        category_repository=inventory_category_repository,
        room_repository=room_repository
    )

    inventory_category_service = providers.Factory(
        InventoryCategoryService,
        inventory_category_repository=inventory_category_repository
    )

    inventory_condition_service = providers.Factory(
        InventoryConditionService,
        inventory_condition_repository=inventory_condition_repository
    )

    log_service = providers.Factory(
        LogService,
        log_repository=log_repository
    )


container = Container()

def get_user_service() -> UserService:
    return container.user_service()

def get_room_service() -> RoomService:
    return container.room_service()

def get_inventory_item_service() -> InventoryItemService:
    return container.inventory_item_service()

def get_inventory_category_service() -> InventoryCategoryService:
    return container.inventory_category_service()

def get_inventory_condition_service() -> InventoryConditionService:
    return container.inventory_condition_service()

def get_log_service() -> LogService:
    return container.log_service()