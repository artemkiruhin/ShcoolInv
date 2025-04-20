from dependency_injector.wiring import inject
from flask import Flask, request
from dependency_injection import get_user_service, get_room_service, get_inventory_condition_service, \
    get_inventory_category_service, get_inventory_item_service, get_log_service, container
from security import *
from config import DEFAULT_JWT_EXPIRES_SECONDS
from flask_utils import Response400, Response401, Response200, Response204, Response404, Response201, Response500
from dtos import *

app = Flask(__name__)
app.container = container
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_SECRET_KEY'] = SECRET_KEY


@app.route("/auth/login", methods=['POST'])
@inject
def login():
    if not request.is_json:
        return Response400.send(message="Request must be JSON")

    username = request.json.get('username')
    password = request.json.get('password')
    if not username or not password:
        return Response400.send(message="Username and password are required")

    service = get_user_service()
    password_hash = hash_data(password)
    login_dto = service.login(username, password_hash)

    if not login_dto or not login_dto.jwt or not login_dto.user_data:
        return Response401.send(message="Invalid credentials")

    response = Response200.send(
        data=login_dto.user_data.__dict__,
        message="Login successful"
    )

    response.set_cookie(
        key='jwt',
        value=login_dto.jwt,
        httponly=True,
        secure=False,
        samesite='Lax',
        max_age=DEFAULT_JWT_EXPIRES_SECONDS
    )
    return response


@app.route("/auth/validate", methods=['GET'])
def validate():
    jwt_token = validate_jwt_token(request.cookies.get('jwt'))
    if not jwt_token:
        return Response401.send(message="Invalid or expired token")
    return Response204.send()


@app.route("/auth/logout", methods=['GET'])
def logout():
    response = Response200.send(message="Logged out successfully")
    response.set_cookie(
        key='jwt',
        value='',
        expires=0,
        max_age=0,
        httponly=True,
        secure=False,
        samesite='Lax',
    )
    return response


@app.route("/users", methods=['GET'])
@inject
def get_users():
    try:
        service = get_user_service()
        users = service.get_all()
        return Response200.send(data=[user.__dict__ for user in users])
    except Exception as e:
        return Response500.send(message=str(e))


@app.route("/users/<int:user_id>", methods=['GET'])
@inject
def get_user(user_id):
    service = get_user_service()
    user = service.get_by_id(user_id)
    if not user:
        return Response404.send(message="User not found")
    return Response200.send(data=user.__dict__)


@app.route("/users", methods=['POST'])
@inject
def create_user():
    if not request.is_json:
        return Response400.send(message="Request must be JSON")

    try:
        data = request.json
        dto = UserCreateDTO(
            username=data.get('username'),
            password_hash=hash_data(data.get('password')),
            email=data.get('email'),
            full_name=data.get('full_name'),
            phone_number=data.get('phone_number'),
            is_admin=data.get('is_admin', False),
            avatar=data.get('avatar')
        )

        service = get_user_service()
        user = service.create(dto)
        if not user:
            return Response400.send(message="User creation failed")
        return Response201.send(data=user.__dict__)
    except Exception as e:
        return Response400.send(message=str(e))


@app.route("/rooms", methods=['GET'])
@inject
def get_rooms():
    service = get_room_service()
    rooms = service.get_all()
    return Response200.send(data=[room.__dict__ for room in rooms])


@app.route("/rooms/<int:room_id>", methods=['GET'])
@inject
def get_room(room_id):
    service = get_room_service()
    room = service.get_by_id(room_id)
    if not room:
        return Response404.send(message="Room not found")
    return Response200.send(data=room.__dict__)


@app.route("/rooms", methods=['POST'])
@inject
def create_room():
    if not request.is_json:
        return Response400.send(message="Request must be JSON")

    try:
        data = request.json
        if not data.get('name') or not data.get('short_name'):
            return Response400.send(message="Name and short_name are required")

        service = get_room_service()
        room_id = service.create(data.get('name'), data.get('short_name'))
        if not room_id:
            return Response400.send(message="Room creation failed")
        return Response201.send(data={"id": room_id})
    except Exception as e:
        return Response400.send(message=str(e))


@app.route("/inventory/conditions", methods=['GET'])
@inject
def get_inventory_conditions():
    service = get_inventory_condition_service()
    conditions = service.get_all()
    return Response200.send(data=[condition.__dict__ for condition in conditions])


@app.route("/inventory/categories", methods=['GET'])
@inject
def get_inventory_categories():
    service = get_inventory_category_service()
    categories = service.get_all()
    return Response200.send(data=[category.__dict__ for category in categories])


@app.route("/inventory/items", methods=['GET'])
@inject
def get_inventory_items():
    is_short = request.args.get('short', 'true').lower() == 'true'
    service = get_inventory_item_service()
    items = service.get_all(is_short)
    return Response200.send(data=[item.__dict__ for item in items])


@app.route("/inventory/items/<int:item_id>", methods=['GET'])
@inject
def get_inventory_item(item_id):
    is_short = request.args.get('short', 'true').lower() == 'true'
    service = get_inventory_item_service()
    item = service.get_by_id(item_id, is_short)
    if not item:
        return Response404.send(message="Item not found")
    return Response200.send(data=item.__dict__)


@app.route("/inventory/items", methods=['POST'])
@inject
def create_inventory_item():
    if not request.is_json:
        return Response400.send(message="Request must be JSON")

    try:
        data = request.json
        required_fields = ['name', 'category_id', 'room_id']
        if not all(field in data for field in required_fields):
            return Response400.send(message=f"Required fields: {', '.join(required_fields)}")

        dto = InventoryItemCreateDTO(
            name=data['name'],
            description=data.get('description'),
            category_id=data['category_id'],
            room_id=data['room_id'],
            assigned_user_id=data.get('assigned_user_id'),
            photo=data.get('photo'),
            purchase_date=data.get('purchase_date'),
            purchase_price=data.get('purchase_price'),
            warranty_until=data.get('warranty_until')
        )

        service = get_inventory_item_service()
        item_id = service.create(dto)
        if not item_id:
            return Response400.send(message="Item creation failed")
        return Response201.send(data={"id": item_id})
    except Exception as e:
        return Response400.send(message=str(e))


@app.route("/logs", methods=['GET'])
@inject
def get_logs():
    service = get_log_service()
    logs = service.get_all()
    return Response200.send(data=[log.__dict__ for log in logs])


if __name__ == "__main__":
    container.wire(modules=[__name__])
    import uvicorn
    uvicorn.run(app, port=5123, host='localhost')