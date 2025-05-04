from flask import Flask
from flask_cors import CORS

from backend.configurations.manual_dependencies import get_consumable_service, get_inventory_condition_repository
from configurations.config import SECRET_KEY, CORS_CONFIGURATION, DEFAULT_JWT_EXPIRES_SECONDS
from configurations.manual_dependencies import (
    get_user_service, get_room_service, get_inventory_condition_service,
    get_inventory_category_service, get_inventory_item_service, get_log_service,
    init_db_session
)
import endpoints.auth_endpoints as auth
import endpoints.users_endpoints as users
import endpoints.rooms_endpoints as rooms
import endpoints.inventory_endpoints as inventory
import endpoints.logs_endpoints as logs
import endpoints.consumable_endpoints as consumables
import endpoints.dev_endpoints as dev_end

app = Flask(__name__)
CORS(app, resources=CORS_CONFIGURATION)
app.secret_key = SECRET_KEY

init_db_session()

# ---- AUTH ----
@app.route("/auth/login", methods=['POST'])
def handle_login():
    return auth.login(get_user_service())

@app.route("/auth/validate", methods=['GET'])
def handle_validate():
    return auth.validate()

@app.route("/auth/logout", methods=['GET'])
def handle_logout():
    return auth.logout()

# ---- USERS ----
@app.route("/users", methods=['GET'])
def handle_get_users():
    return users.get_users(get_user_service())

@app.route("/users/<int:user_id>", methods=['GET'])
def handle_get_user(user_id):
    return users.get_user(user_id, get_user_service())

@app.route("/users", methods=['POST'])
def handle_create_user():
    return users.create_user(get_user_service())

@app.route("/init", methods=['POST'])
def handle_init_user():
    return users.init(get_user_service())

# ---- ROOMS ----
@app.route("/rooms", methods=['GET'])
def handle_get_rooms():
    return rooms.get_rooms(get_room_service())

@app.route("/rooms/<int:room_id>", methods=['GET'])
def handle_get_room(room_id):
    return rooms.get_room(room_id, get_room_service())

@app.route("/rooms", methods=['POST'])
def handle_create_room():
    return rooms.create_room(get_room_service())

# ---- INVENTORY CONDITIONS ----
@app.route("/inventory/conditions", methods=['GET'])
def handle_get_inventory_conditions():
    return inventory.get_inventory_conditions(get_inventory_condition_service())

@app.route("/inventory/conditions/create", methods=['POST'])
def handle_create_inventory_condition():
    return inventory.create_inventory_condition(get_inventory_condition_service())

@app.route("/inventory/conditions/delete/<int:condition_id>", methods=['DELETE'])
def handle_delete_inventory_condition(condition_id):
    return inventory.delete_inventory_condition(condition_id, get_inventory_condition_service())

@app.route("/inventory/conditions/update", methods=['PATCH'])
def handle_update_inventory_condition():
    return inventory.update_inventory_condition(get_inventory_condition_service())

# ---- INVENTORY CATEGORIES ----
@app.route("/inventory/categories", methods=['GET'])
def handle_get_inventory_categories():
    return inventory.get_inventory_categories(get_inventory_category_service())

@app.route("/inventory/categories/create", methods=['POST'])
def handle_create_inventory_category():
    return inventory.create_inventory_category(get_inventory_category_service())

@app.route("/inventory/categories/delete/<int:category_id>", methods=['DELETE'])
def handle_delete_inventory_category(category_id):
    return inventory.delete_inventory_category(category_id, get_inventory_category_service())

@app.route("/inventory/categories/update", methods=['PATCH'])
def handle_update_inventory_category():
    return inventory.update_inventory_category(get_inventory_category_service())

# ---- INVENTORY ITEMS ----
@app.route("/inventory/items", methods=['GET'])
def handle_get_inventory_items():
    return inventory.get_inventory_items(get_inventory_item_service())

@app.route("/inventory/items/<int:item_id>", methods=['GET'])
def handle_get_inventory_item(item_id):
    return inventory.get_inventory_item(item_id, get_inventory_item_service())

@app.route("/inventory/items", methods=['POST'])
def handle_create_inventory_item():
    return inventory.create_inventory_item(get_inventory_item_service())

@app.route("/inventory/items/update", methods=['PATCH'])
def handle_update_inventory_item():
    return inventory.update_inventory_item(get_inventory_item_service())

@app.route("/inventory/delete/<int:item_id>", methods=['DELETE'])
def handle_delete_inventory_item(item_id):
    return inventory.delete_inventory_item(item_id, get_inventory_item_service())

# ---- LOGS ----
@app.route("/logs", methods=['GET'])
def handle_get_logs():
    return logs.get_logs(get_log_service())

# ---- CONSUMABLES ----
@app.route("/consumables/all", methods=['GET'])
def handle_get_consumables():
    return consumables.get_consumables(get_consumable_service())

@app.route("/consumables/create", methods=['POST'])
def handle_create_consumables():
    return consumables.create_consumable(get_consumable_service())

@app.route("/consumables/update", methods=['PATCH'])
def handle_update_consumables():
    return consumables.update_consumable(get_consumable_service())

@app.route("/consumables/delete/<int:item_id>", methods=['DELETE'])
def handle_delete_consumables(item_id):
    return consumables.delete_consumable(item_id, get_consumable_service())


@app.route("/dev/init-db", methods=['POST'])
def init_db():
    return dev_end.init_db(get_user_service(), get_room_service(), get_inventory_condition_service(), get_inventory_category_service(), get_inventory_item_service(), get_consumable_service(), get_log_service())

if __name__ == "__main__":
    import sys
    app.run(port=5123, host='localhost')