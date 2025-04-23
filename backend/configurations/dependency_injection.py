from dependency_injector import containers, providers
from backend.configurations.config import SessionLocal
from backend.core.repositories import (
    UserRepository,
    RoomRepository,
    InventoryItemRepository,
    InventoryCategoryRepository,
    InventoryConditionRepository,
    LogRepository
)
from backend.services.services import (
    UserService,
    RoomService,
    InventoryItemService,
    InventoryCategoryService,
    InventoryConditionService,
    LogService
)

class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        modules=[
            "endpoints.auth_endpoints",
            "endpoints.users_endpoints",
            "endpoints.rooms_endpoints",
            "endpoints.inventory_endpoints",
            "endpoints.logs_endpoints",
            "core.dtos",
            "core.entities",
            "core.repositories",
            "services.security",
            "services.services",
            "configurations.config",
            "configurations.flask_utils",
            "api"
        ]
    )

    db_session = providers.Singleton(SessionLocal)

    # Repositories
    user_repository = providers.Factory(UserRepository, session=db_session)
    room_repository = providers.Factory(RoomRepository, session=db_session)
    inventory_item_repository = providers.Factory(InventoryItemRepository, session=db_session)
    inventory_category_repository = providers.Factory(InventoryCategoryRepository, session=db_session)
    inventory_condition_repository = providers.Factory(InventoryConditionRepository, session=db_session)
    log_repository = providers.Factory(LogRepository, session=db_session)

    # Services
    user_service = providers.Factory(UserService, user_repository=user_repository)
    room_service = providers.Factory(RoomService, room_repository=room_repository)
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
