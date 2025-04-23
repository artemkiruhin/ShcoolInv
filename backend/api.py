from flask import Flask
from flask_cors import CORS
from configurations.config import SECRET_KEY, CORS_CONFIGURATION, DEFAULT_JWT_EXPIRES_SECONDS
from configurations.dependency_injection import Container
import endpoints.auth_endpoints as auth
import endpoints.users_endpoints as users
import endpoints.rooms_endpoints as rooms
import endpoints.inventory_endpoints as inventory
import endpoints.logs_endpoints as logs

app = Flask(__name__)
CORS(app, resources=CORS_CONFIGURATION)

container = Container()

# ---- AUTH ----
@app.route("/auth/login", methods=['POST'])
def handle_login():
    return auth.login(container.user_service())

@app.route("/auth/validate", methods=['GET'])
def handle_validate():
    return auth.validate()

@app.route("/auth/logout", methods=['GET'])
def handle_logout():
    return auth.logout()

# ---- USERS ----
@app.route("/users", methods=['GET'])
def handle_get_users():
    return users.get_users(container.user_service())

@app.route("/users/<int:user_id>", methods=['GET'])
def handle_get_user(user_id):
    return users.get_user(user_id, container.user_service())

@app.route("/users", methods=['POST'])
def handle_create_user():
    return users.create_user(container.user_service())

@app.route("/init", methods=['POST'])
def handle_init_user():
    return users.init(container.user_service())

# ---- ROOMS ----
@app.route("/rooms", methods=['GET'])
def handle_get_rooms():
    return rooms.get_rooms(container.room_service())

@app.route("/rooms/<int:room_id>", methods=['GET'])
def handle_get_room(room_id):
    return rooms.get_room(room_id, container.room_service())

@app.route("/rooms", methods=['POST'])
def handle_create_room():
    return rooms.create_room(container.room_service())

# ---- INVENTORY CONDITIONS ----
@app.route("/inventory/conditions", methods=['GET'])
def handle_get_inventory_conditions():
    return inventory.get_inventory_conditions(container.inventory_condition_service())

@app.route("/inventory/conditions/create", methods=['POST'])
def handle_create_inventory_condition():
    return inventory.create_inventory_condition(container.inventory_condition_service())

@app.route("/inventory/conditions/delete/<int:condition_id>", methods=['DELETE'])
def handle_delete_inventory_condition(condition_id):
    return inventory.delete_inventory_condition(condition_id, container.inventory_condition_service())

@app.route("/inventory/conditions/update", methods=['PATCH'])
def handle_update_inventory_condition():
    return inventory.update_inventory_condition(container.inventory_condition_service())

# ---- INVENTORY CATEGORIES ----
@app.route("/inventory/categories", methods=['GET'])
def handle_get_inventory_categories():
    return inventory.get_inventory_categories(container.inventory_category_service())

@app.route("/inventory/categories/create", methods=['POST'])
def handle_create_inventory_category():
    return inventory.create_inventory_category(container.inventory_category_service())

@app.route("/inventory/categories/delete/<int:category_id>", methods=['DELETE'])
def handle_delete_inventory_category(category_id):
    return inventory.delete_inventory_category(category_id, container.inventory_category_service())

@app.route("/inventory/categories/update", methods=['PATCH'])
def handle_update_inventory_category():
    return inventory.update_inventory_category(container.inventory_category_service())

# ---- INVENTORY ITEMS ----
@app.route("/inventory/items", methods=['GET'])
def handle_get_inventory_items():
    return inventory.get_inventory_items(container.inventory_item_service())

@app.route("/inventory/items/<int:item_id>", methods=['GET'])
def handle_get_inventory_item(item_id):
    return inventory.get_inventory_item(item_id, container.inventory_item_service())

@app.route("/inventory/items", methods=['POST'])
def handle_create_inventory_item():
    return inventory.create_inventory_item(container.inventory_item_service())

@app.route("/inventory/items/update", methods=['PATCH'])
def handle_update_inventory_item():
    return inventory.update_inventory_item(container.inventory_item_service())

@app.route("/inventory/delete/<int:item_id>", methods=['DELETE'])
def handle_delete_inventory_item(item_id):
    return inventory.delete_inventory_item(item_id, container.inventory_item_service())

# ---- LOGS ----
@app.route("/logs", methods=['GET'])
def handle_get_logs():
    return logs.get_logs(container.log_service())

if __name__ == "__main__":
    import sys

    print("InventoryItem module:", sys.modules.get('backend.core.entities'))
    app.run(port=5123, host='localhost')