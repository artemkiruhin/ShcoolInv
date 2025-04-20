from flask import Flask
from configurations.dependency_injection import container
import endpoints.auth_endpoints as auth
import endpoints.users_endpoints as users
import endpoints.rooms_endpoints as rooms
import endpoints.inventory_endpoints as inventory
import endpoints.logs_endpoints as logs

app = Flask(__name__)
app.container = container
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_SECRET_KEY'] = SECRET_KEY


@app.route("/auth/login", methods=['POST'])
def login(): return auth.login()

@app.route("/auth/validate", methods=['GET'])
def validate(): return auth.validate()

@app.route("/auth/logout", methods=['GET'])
def logout(): return auth.logout()



@app.route("/users", methods=['GET'])
def get_users(): return users.get_users()

@app.route("/users/<int:user_id>", methods=['GET'])
def get_user(user_id): return users.get_user(user_id)

@app.route("/users", methods=['POST'])
def create_user(): return users.create_user()



@app.route("/rooms", methods=['GET'])
def get_rooms(): return rooms.get_rooms()

@app.route("/rooms/<int:room_id>", methods=['GET'])
def get_room(room_id): return rooms.get_room(room_id)

@app.route("/rooms", methods=['POST'])
def create_room(): rooms.create_room()



@app.route("/inventory/conditions", methods=['GET'])
def get_inventory_conditions(): return inventory.get_inventory_conditions()

@app.route("/inventory/conditions/create", methods=['POST'])
def create_inventory_conditions(): return inventory.create_inventory_condition()

@app.route("/inventory/conditions/delete/<int:condition_id>", methods=['DELETE'])
def delete_inventory_condition(condition_id: int): return inventory.delete_inventory_condition(condition_id)

@app.route("/inventory/conditions/update", methods=['PATCH'])
def update_inventory_condition(): return inventory.update_inventory_condition()



@app.route("/inventory/categories", methods=['GET'])
def get_inventory_categories(): return inventory.get_inventory_categories()

@app.route("/inventory/categories/create", methods=['POST'])
def create_inventory_category(): return inventory.create_inventory_category()

@app.route("/inventory/categories/delete/<int:category_id>", methods=['DELETE'])
def delete_inventory_category(category_id: int): return inventory.delete_inventory_category(category_id)

@app.route("/inventory/categories/update", methods=['PATCH'])
def update_inventory_category(): return inventory.update_inventory_category()

@app.route("/inventory/items", methods=['GET'])
def get_inventory_items(): return inventory.get_inventory_items()

@app.route("/inventory/items/<int:item_id>", methods=['GET'])
def get_inventory_item(item_id): return inventory.get_inventory_item(item_id)

@app.route("/inventory/items", methods=['POST'])
def create_inventory_item(): return inventory.create_inventory_item()

@app.route("/inventory/items/update", methods=['PATCH'])
def update_inventory_item(): return inventory.update_inventory_item()

@app.route("/inventory/delete/<int:category_id>", methods=['DELETE'])
def delete_inventory_item(category_id: int): return inventory.delete_inventory_item(category_id)



@app.route("/logs", methods=['GET'])
def get_logs(): return logs.get_logs()



if __name__ == "__main__":
    container.wire(modules=[__name__])
    import uvicorn
    uvicorn.run(app, port=5123, host='localhost')