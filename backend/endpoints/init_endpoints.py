from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import logging
from typing import List
import bcrypt

from backend.configurations.database import get_db
from backend.core.entities import (
    User, Room, InventoryCategory, InventoryItem,
    Consumable, Log, InventoryCondition, LogType
)
from backend.core.repositories import (
    UserRepository, RoomRepository, InventoryCategoryRepository,
    InventoryItemRepository, ConsumableRepository, LogRepository
)

logger = logging.getLogger(__name__)
init_router = APIRouter(prefix="/init", tags=["initialization"])


def hash_data(data: str) -> str:
    """
    Хеширует данные с помощью bcrypt
    """
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(data.encode('utf-8'), salt)
    return hashed.decode('utf-8')


@init_router.post("/database", summary="Инициализация базы данных тестовыми данными")
async def initialize_database(
        db: Session = Depends(get_db),
        force: bool = True,
        create_users: bool = True,
        create_rooms: bool = True,
        create_categories: bool = True,
        create_items: bool = True,
        create_consumables: bool = True,
        create_logs: bool = True
):
    """
    Инициализация базы данных тестовыми данными.

    Параметры:
    - force: Переинициализировать, даже если данные уже существуют (по умолчанию: False)
    - create_users: Создать тестовых пользователей (по умолчанию: True)
    - create_rooms: Создать тестовые помещения (по умолчанию: True)
    - create_categories: Создать тестовые категории (по умолчанию: True)
    - create_items: Создать тестовые предметы инвентаря (по умолчанию: True)
    - create_consumables: Создать тестовые расходники (по умолчанию: True)
    - create_logs: Создать тестовые логи (по умолчанию: True)
    """
    try:
        if not force:
            user_repo = UserRepository(db)
            if user_repo.get_all(limit=1):
                raise HTTPException(
                    status_code=400,
                    detail="База данных уже содержит данные. Используйте force=True для переинициализации."
                )

        result = {}

        if create_users:
            users = _create_sample_users(db)
            result["users_created"] = len(users)
        else:
            users = UserRepository(db).get_all()
            result["users_existing"] = len(users)

        if create_rooms:
            rooms = _create_sample_rooms(db)
            result["rooms_created"] = len(rooms)
        else:
            rooms = RoomRepository(db).get_all()
            result["rooms_existing"] = len(rooms)

        if create_categories:
            categories = _create_sample_categories(db)
            result["categories_created"] = len(categories)
        else:
            categories = InventoryCategoryRepository(db).get_all()
            result["categories_existing"] = len(categories)

        if create_items and categories and (users or create_users) and (rooms or create_rooms):
            items = _create_sample_inventory_items(db, categories, rooms, users)
            result["inventory_items_created"] = len(items)
        else:
            items = []
            result["inventory_items_skipped"] = "Отсутствуют необходимые данные"

        if create_consumables:
            consumables = _create_sample_consumables(db)
            result["consumables_created"] = len(consumables)
        else:
            consumables = []
            result["consumables_skipped"] = "Отключено параметром"

        if create_logs and (users or create_users) and (items or not create_items) and (
                consumables or not create_consumables):
            logs = _create_sample_logs(db, users, items, consumables)
            result["logs_created"] = len(logs)
        else:
            logs = []
            result["logs_skipped"] = "Отсутствуют необходимые данные"

        return {
            "success": True,
            "message": "Инициализация базы данных завершена",
            "details": result
        }

    except Exception as e:
        logger.error(f"Ошибка инициализации базы данных: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка инициализации базы данных: {str(e)}"
        )


def _create_sample_users(db: Session) -> List[User]:
    """Создание тестовых пользователей"""
    repo = UserRepository(db)
    users_data = [
        {
            "username": "glavbuh",
            "password_hash": hash_data("admin_password"),
            "email": "glavbuh@example.com",
            "full_name": "Иванова Мария Петровна",
            "phone_number": "79001234567",
            "is_admin": True
        },
        {
            "username": "economist",
            "password_hash": hash_data("manager_password"),
            "email": "economist@example.com",
            "full_name": "Петрова Ольга Ивановна",
            "phone_number": "79011234567",
            "is_admin": True
        },
        {
            "username": "zavhoz",
            "password_hash": hash_data("tech_password"),
            "email": "zavhoz@example.com",
            "full_name": "Сидоров Алексей Владимирович",
            "phone_number": "79021234567",
            "is_admin": False
        }
    ]

    created_users = []
    for user_data in users_data:
        try:
            user = User.create(**user_data)
            created_user = repo.create(user)
            created_users.append(created_user)
        except Exception as e:
            logger.error(f"Ошибка создания пользователя {user_data['username']}: {str(e)}")

    return created_users


def _create_sample_rooms(db: Session) -> List[Room]:
    """Создание тестовых помещений"""
    repo = RoomRepository(db)
    rooms_data = [
        {"name": "Кабинет главного бухгалтера", "description": "Рабочий кабинет главного бухгалтера"},
        {"name": "Бухгалтерия", "description": "Отдел бухгалтерии"},
        {"name": "Склад канцелярии", "description": "Склад для хранения канцелярских товаров"},
        {"name": "Архив", "description": "Помещение для хранения документов"}
    ]

    created_rooms = []
    for room_data in rooms_data:
        try:
            room = Room.create(**room_data)
            created_room = repo.create(room)
            created_rooms.append(created_room)
        except Exception as e:
            logger.error(f"Ошибка создания помещения {room_data['name']}: {str(e)}")

    return created_rooms


def _create_sample_categories(db: Session) -> List[InventoryCategory]:
    """Создание тестовых категорий инвентаря"""
    repo = InventoryCategoryRepository(db)
    categories_data = [
        {
            "name": "Офисная мебель",
            "short_name": "МЕБЕЛЬ",
            "description": "Мебель для офисных помещений"
        },
        {
            "name": "Оргтехника",
            "short_name": "ОРГТЕХ",
            "description": "Техника для офисной работы"
        },
        {
            "name": "Канцелярские товары",
            "short_name": "КАНЦЕЛЯРИЯ",
            "description": "Товары для канцелярских нужд"
        },
        {
            "name": "Архивное оборудование",
            "short_name": "АРХИВ",
            "description": "Оборудование для хранения документов"
        }
    ]

    created_categories = []
    for category_data in categories_data:
        try:
            category = InventoryCategory.create(**category_data)
            created_category = repo.create(category)
            created_categories.append(created_category)
        except Exception as e:
            logger.error(f"Ошибка создания категории {category_data['name']}: {str(e)}")

    return created_categories


def _create_sample_inventory_items(
        db: Session,
        categories: List[InventoryCategory],
        rooms: List[Room],
        users: List[User]
) -> List[InventoryItem]:
    """Создание тестовых предметов инвентаря"""
    if not categories or not rooms or not users:
        logger.warning("Пропуск создания предметов инвентаря - отсутствуют необходимые данные")
        return []

    repo = InventoryItemRepository(db)
    items = []

    def get_random(items_list, none_chance=0.2):
        if random.random() < none_chance or not items_list:
            return None
        return random.choice(items_list)

    # Мебель
    furniture_category = next((c for c in categories if c.short_name == "МЕБЕЛЬ"), None)
    if furniture_category:
        furniture_items = [
            {"name": "Рабочий стол", "description": "Деревянный стол для работы", "price": 15000},
            {"name": "Офисное кресло", "description": "Эргономичное кресло", "price": 8000},
            {"name": "Шкаф для документов", "description": "Металлический шкаф", "price": 12000},
            {"name": "Диван для посетителей", "description": "Кожаный диван", "price": 25000}
        ]

        for i, item_data in enumerate(furniture_items, 1):
            try:
                room = get_random(rooms)
                user = get_random(users)

                item = InventoryItem.create(
                    inventory_number=f"МЕБ-{1000 + i}",
                    name=item_data["name"],
                    description=item_data["description"],
                    category_id=furniture_category.id,
                    condition=random.choice(list(InventoryCondition)),
                    room_id=room.id if room else None,
                    user_id=user.id if user else None,
                    purchase_date=datetime.now() - timedelta(days=random.randint(30, 365)),
                    purchase_price=item_data["price"] + random.randint(-2000, 2000),
                    warranty_until=datetime.now() + timedelta(days=random.randint(30, 365)))

                created_item = repo.create(item)
                items.append(created_item)
            except Exception as e:
                logger.error(f"Ошибка создания мебели {item_data['name']}: {str(e)}")

    # Оргтехника
    tech_category = next((c for c in categories if c.short_name == "ОРГТЕХ"), None)
    if tech_category:
        tech_items = [
            {"name": "Калькулятор", "description": "Бухгалтерский калькулятор", "price": 1500},
            {"name": "Принтер", "description": "Лазерный принтер", "price": 18000},
            {"name": "Шредер", "description": "Уничтожитель документов", "price": 9000}
        ]

        for i, item_data in enumerate(tech_items, 1):
            try:
                room = get_random(rooms)
                user = get_random(users)

                item = InventoryItem.create(
                    inventory_number=f"ОРГ-{2000 + i}",
                    name=item_data["name"],
                    description=item_data["description"],
                    category_id=tech_category.id,
                    condition=random.choice(list(InventoryCondition)),
                    room_id=room.id if room else None,
                    user_id=user.id if user else None,
                    purchase_date=datetime.now() - timedelta(days=random.randint(30, 365)),
                    purchase_price=item_data["price"] + random.randint(-1000, 1000),
                    warranty_until=datetime.now() + timedelta(days=random.randint(30, 365)))

                created_item = repo.create(item)
                items.append(created_item)
            except Exception as e:
                logger.error(f"Ошибка создания оргтехники {item_data['name']}: {str(e)}")

    return items


def _create_sample_consumables(db: Session) -> List[Consumable]:
    """Создание тестовых расходных материалов"""
    repo = ConsumableRepository(db)
    consumables_data = [
        {
            "name": "Бумага для документов",
            "description": "Бумага формата А4, 80 г/м²",
            "quantity": 1000,
            "min_quantity": 200,
            "unit": "пачка"
        },
        {
            "name": "Папки-скоросшиватели",
            "description": "Папки для документов с зажимом",
            "quantity": 50,
            "min_quantity": 20,
            "unit": "шт."
        },
        {
            "name": "Ручки шариковые",
            "description": "Синие ручки, упаковка",
            "quantity": 100,
            "min_quantity": 30,
            "unit": "шт."
        },
        {
            "name": "Калькуляторы",
            "description": "Базовые бухгалтерские калькуляторы",
            "quantity": 10,
            "min_quantity": 5,
            "unit": "шт."
        }
    ]

    created_consumables = []
    for consumable_data in consumables_data:
        try:
            consumable = Consumable.create(**consumable_data)
            created_consumable = repo.create(consumable)
            created_consumables.append(created_consumable)
        except Exception as e:
            logger.error(f"Ошибка создания расходника {consumable_data['name']}: {str(e)}")

    return created_consumables


def _create_sample_logs(
        db: Session,
        users: List[User],
        items: List[InventoryItem],
        consumables: List[Consumable]
) -> List[Log]:
    """Создание тестовых логов"""
    if not users:
        logger.warning("Пропуск создания логов - нет доступных пользователей")
        return []

    repo = LogRepository(db)
    logs = []

    # Логи входа
    for _ in range(5):
        user = random.choice(users)
        try:
            log = Log.create(
                description=f"Пользователь {user.full_name} вошел в систему",
                type=LogType.INFO.value,
                user_id=user.id
            )
            created_log = repo.create(log)
            logs.append(created_log)
        except Exception as e:
            logger.error(f"Ошибка создания лога пользователя: {str(e)}", exc_info=True)

    # Логи работы с инвентарем
    if items:
        for _ in range(3):
            item = random.choice(items)
            user = random.choice(users)
            try:
                actions = [
                    f"был перемещен в помещение {random.choice(['Бухгалтерия', 'Архив', 'Кабинет главного бухгалтера'])}",
                    "был отмечен как требующий ремонта",
                    "прошел плановую проверку"
                ]
                log = Log.create(
                    description=f"Инвентарный предмет {item.name} {random.choice(actions)}",
                    type=LogType.INFO.value,
                    user_id=user.id
                )
                created_log = repo.create(log)
                logs.append(created_log)
            except Exception as e:
                logger.error(f"Ошибка создания лога инвентаря: {str(e)}", exc_info=True)

    # Логи работы с расходниками
    if consumables:
        for _ in range(2):
            consumable = random.choice(consumables)
            user = random.choice(users)
            try:
                actions = [
                    f"был пополнен на {random.randint(5, 20)} {consumable.unit}",
                    "был списан по акту",
                    f"достиг минимального уровня запасов ({consumable.min_quantity} {consumable.unit})"
                ]
                log = Log.create(
                    description=f"Расходный материал {consumable.name} {random.choice(actions)}",
                    type=LogType.INFO.value,
                    user_id=user.id
                )
                created_log = repo.create(log)
                logs.append(created_log)
            except Exception as e:
                logger.error(f"Ошибка создания лога расходников: {str(e)}", exc_info=True)

    # Логи документооборота
    for _ in range(3):
        user = random.choice(users)
        try:
            actions = [
                "сформировал отчет за месяц",
                "подписал акт сверки",
                "отправил документы в архив",
                "получил входящие документы"
            ]
            log = Log.create(
                description=f"Бухгалтер {user.full_name} {random.choice(actions)}",
                type=LogType.INFO.value,
                user_id=user.id
            )
            created_log = repo.create(log)
            logs.append(created_log)
        except Exception as e:
            logger.error(f"Ошибка создания лога документооборота: {str(e)}", exc_info=True)

    return logs