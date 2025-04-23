from backend.core.dtos import InventoryItemCreateDTO, InventoryItemUpdateDTO
from backend.configurations.flask_utils import authorized, Response400, Response201, Response200, Response404, Response500
from flask import request

@authorized
def get_inventory_conditions(service):
    conditions = service.get_all()
    return Response200.send(data=[condition.__dict__ for condition in conditions])

@authorized
def create_inventory_condition(service):
    data = request.json
    required_fields = ['name', 'description']
    if not all(field in data for field in required_fields):
        return Response400.send(message=f"Required fields: {', '.join(required_fields)}")
    result = service.create(data['name'], data['description'])
    return Response201.send(data=result) if result is not None else Response500.send()

@authorized
def delete_inventory_condition(condition_id: int, service):
    result = service.delete(condition_id)
    return Response200.send(data=result) if result else Response500.send()

@authorized
def update_inventory_condition(service):
    data = request.json
    required_fields = ['condition_id', 'name', 'description']
    if not all(field in data for field in required_fields):
        return Response400.send(message=f"Required fields: {', '.join(required_fields)}")
    result = service.update(data['condition_id'], data['name'], data['description'])
    return Response200.send(data=result) if result is not None else Response500.send()

@authorized
def get_inventory_categories(service):
    categories = service.get_all()
    return Response200.send(data=[category.__dict__ for category in categories])

@authorized
def create_inventory_category(service):
    data = request.json
    required_fields = ['name', 'short_name', 'description']
    if not all(field in data for field in required_fields):
        return Response400.send(message=f"Required fields: {', '.join(required_fields)}")
    result = service.create(data['name'], data['short_name'], data['description'])
    return Response201.send(data=result) if result is not None else Response500.send()

@authorized
def delete_inventory_category(category_id: int, service):
    result = service.delete(category_id)
    return Response200.send(data=result) if result else Response500.send()

@authorized
def update_inventory_category(service):
    data = request.json
    required_fields = ['category_id', 'name', 'short_name', 'description']
    if not all(field in data for field in required_fields):
        return Response400.send(message=f"Required fields: {', '.join(required_fields)}")
    result = service.update(data['category_id'], data['name'], data['short_name'], data['description'])
    return Response200.send(data=result) if result is not None else Response500.send()

@authorized
def get_inventory_items(service):
    is_short = request.args.get('short', 'true').lower() == 'true'
    items = service.get_all(is_short)
    return Response200.send(data=[item.__dict__ for item in items])

@authorized
def get_inventory_item(item_id, service):
    is_short = request.args.get('short', 'true').lower() == 'true'
    item = service.get_by_id(item_id, is_short)
    if not item:
        return Response404.send(message="Item not found")
    return Response200.send(data=item.__dict__)

@authorized
def create_inventory_item(service):
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

        item_id = service.create(dto)
        if not item_id:
            return Response400.send(message="Item creation failed")
        return Response201.send(data={"id": item_id})
    except Exception as e:
        return Response400.send(message=str(e))

@authorized
def update_inventory_item(service):
    if not request.is_json:
        return Response400.send(message="Request must be JSON")

    try:
        data = request.json
        required_fields = ['item_id']
        if not all(field in data for field in required_fields):
            return Response400.send(message=f"Required fields: {', '.join(required_fields)}")

        update_dto = InventoryItemUpdateDTO(
            item_id=data['item_id'],
            name=data['name'],
            description=data['description'],
            category_id=data['category_id'],
            room_id=data['room_id'],
            condition_id=data['condition_id'],
            assigned_user_id=data['assigned_user_id'],
            photo=data['photo'],
            purchase_date=data['purchase_date'],
            purchase_price=data['purchase_price'],
            warranty_until=data['warranty_until'],
            is_written_off=data['is_written_off']
        )
        item_id = service.update(update_dto)
        if not item_id:
            return Response400.send(message="Item update failed")
        return Response200.send(data={"id": item_id})
    except Exception as e:
        return Response400.send(message=str(e))

@authorized
def delete_inventory_item(item_id: int, service):
    result = service.delete(item_id)
    return Response200.send(data=result) if result else Response500.send()