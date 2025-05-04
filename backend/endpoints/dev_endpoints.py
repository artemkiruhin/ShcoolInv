from backend.core.dtos import (
    UserCreateDTO,
    InventoryItemCreateDTO,
    InventoryItemUpdateDTO
)
from backend.configurations.flask_utils import (
    authorized,
    Response201,
    Response200,
    Response500
)
from datetime import datetime, timedelta
import random
from flask import Blueprint

from backend.services.services import *


def init_db(
    user_service: UserService,
    room_service: RoomService,
    inventory_condition_service: InventoryConditionService,
    inventory_category_service: InventoryCategoryService,
    inventory_item_service: InventoryItemService,
    consumable_service: ConsumableService,
    log_service: LogService
):
    try:
        # 1. Создаем администратора
        admin = user_service.create(UserCreateDTO(
            username="admin",
            password_hash="admin123",
            email="admin@example.com",
            full_name="Admin Adminov",
            phone_number="79101234567",
            is_admin=True
        ))
        if not admin:
            raise ValueError("Failed to create admin user")
        admin_id = admin.id

        # 2. Создаем обычных пользователей
        user1 = user_service.create(UserCreateDTO(
            username="user1",
            password_hash="user1123",
            email="user1@example.com",
            full_name="User 1 Userov",
            phone_number="7910111111",
            is_admin=False
        ))
        user2 = user_service.create(UserCreateDTO(
            username="user2",
            password_hash="user2123",
            email="user2@example.com",
            full_name="User 2 Userov",
            phone_number="7910222222",
            is_admin=False
        ))
        user3 = user_service.create(UserCreateDTO(
            username="user3",
            password_hash="user3123",
            email="user3@example.com",
            full_name="User 3 Userov",
            phone_number="7910333333",
            is_admin=False
        ))
        user4 = user_service.create(UserCreateDTO(
            username="user4",
            password_hash="user4123",
            email="user4@example.com",
            full_name="User 4 Userov",
            phone_number="7910444444",
            is_admin=False
        ))
        user5 = user_service.create(UserCreateDTO(
            username="user5",
            password_hash="user5123",
            email="user5@example.com",
            full_name="User 5 Userov",
            phone_number="7910555555",
            is_admin=False
        ))

        user_ids = [
            user.id for user in [user1, user2, user3, user4, user5]
            if user is not None
        ]

        # 3. Создаем комнаты
        room_go = room_service.create("Главный офис", "GO")
        room_sk = room_service.create("Склад", "SK")
        room_sr = room_service.create("Серверная", "SR")
        room_p1 = room_service.create("Переговорная 1", "P1")
        room_p2 = room_service.create("Переговорная 2", "P2")

        room_ids = [
            room.id for room in [room_go, room_sk, room_sr, room_p1, room_p2]
            if room is not None
        ]

        # 4. Создаем состояния инвентаря
        condition_new = inventory_condition_service.create("Новый", "Новое оборудование")
        condition_used = inventory_condition_service.create("Б/у", "Бывшее в употреблении")
        condition_repair = inventory_condition_service.create("Требует ремонта", "Необходим ремонт")
        condition_writeoff = inventory_condition_service.create("Списано", "Оборудование списано")

        condition_ids = [
            condition.id for condition in [condition_new, condition_used, condition_repair, condition_writeoff]
            if condition is not None
        ]

        # 5. Создаем категории инвентаря
        category_pc = inventory_category_service.create("Компьютеры", "PC", "Компьютерная техника")
        category_mn = inventory_category_service.create("Мониторы", "MN", "Мониторы и дисплеи")
        category_nw = inventory_category_service.create("Сетевое оборудование", "NW", "Сетевое оборудование")
        category_of = inventory_category_service.create("Оргтехника", "OF", "Оргтехника")
        category_fr = inventory_category_service.create("Мебель", "FR", "Мебель и интерьер")

        category_ids = [
            category.id for category in [category_pc, category_mn, category_nw, category_of, category_fr]
            if category is not None
        ]

        # 6. Создаем инвентарные предметы
        item1 = inventory_item_service.create(InventoryItemCreateDTO(
            name="Ноутбук Dell XPS",
            description="Мощный ноутбук для разработчиков",
            category_id=category_pc.id,
            room_id=room_go.id,
            assigned_user_id=user1.id,
            photo=None,
            purchase_date=datetime.now() - timedelta(days=random.randint(30, 365)),
            purchase_price=float(random.randint(5000, 50000)),
            warranty_until=datetime.now() + timedelta(days=random.randint(180, 720))
        ))

        item2 = inventory_item_service.create(InventoryItemCreateDTO(
            name="Монитор LG 27\"",
            description="4K монитор с IPS матрицей",
            category_id=category_mn.id,
            room_id=room_go.id,
            assigned_user_id=user2.id,
            photo=None,
            purchase_date=datetime.now() - timedelta(days=random.randint(30, 365)),
            purchase_price=float(random.randint(10000, 30000)),
            warranty_until=datetime.now() + timedelta(days=random.randint(180, 720))
        ))

        item3 = inventory_item_service.create(InventoryItemCreateDTO(
            name="Маршрутизатор Cisco",
            description="Профессиональный маршрутизатор",
            category_id=category_nw.id,
            room_id=room_sr.id,
            assigned_user_id=admin_id,
            photo=None,
            purchase_date=datetime.now() - timedelta(days=random.randint(30, 365)),
            purchase_price=float(random.randint(15000, 40000)),
            warranty_until=datetime.now() + timedelta(days=random.randint(180, 720))
        ))

        item_ids = [
            item.id for item in [item1, item2, item3]
            if item is not None
        ]

        # 7. Создаем расходные материалы
        consumable1 = consumable_service.create("Бумага A4", "Офисная бумага 80г/м2", 50)
        consumable2 = consumable_service.create("Картридж HP 123", "Черный картридж для HP LaserJet", 3)
        consumable3 = consumable_service.create("Кабели Ethernet", "Патч-корды 1м", 12)

        consumable_ids = [
            consumable.id for consumable in [consumable1, consumable2, consumable3]
            if consumable is not None
        ]

        # 8. Создаем логи
        log1 = log_service.create("Система инициализирована", 1, None)
        log2 = log_service.create("Создан новый пользователь", 1, f"/users/{user1.id}")
        log3 = log_service.create("Добавлен новый инвентарный предмет", 1, f"/items/{item1.id}")
        log4 = log_service.create("Обновлены данные комнаты", 2, f"/rooms/{room_go.id}")
        log5 = log_service.create("Списано оборудование", 3, f"/items/{item3.id}")

        log_count = sum(1 for log in [log1, log2, log3, log4, log5] if log)

        return Response201.send(data={
            "users": len(user_ids) + (1 if admin_id else 0),
            "rooms": len(room_ids),
            "conditions": len(condition_ids),
            "categories": len(category_ids),
            "items": len(item_ids),
            "consumables": len(consumable_ids),
            "logs": log_count
        })

    except Exception as e:
        return Response500.send(message=f"Database initialization failed: {str(e)}")