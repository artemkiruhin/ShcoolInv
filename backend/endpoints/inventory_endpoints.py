from dependency_injector.wiring import inject
from dependency_injection import get_inventory_item_service, get_inventory_category_service, \
    get_inventory_condition_service
from dtos import InventoryItemCreateDTO
from flask_utils import authorized, Response400, Response201, Response200, Response404
from flask import request

@inject
@authorized
def get_inventory_conditions():
    service = get_inventory_condition_service()
    conditions = service.get_all()
    return Response200.send(data=[condition.__dict__ for condition in conditions])



@inject
@authorized
def get_inventory_categories():
    service = get_inventory_category_service()
    categories = service.get_all()
    return Response200.send(data=[category.__dict__ for category in categories])



@inject
@authorized
def get_inventory_items():
    is_short = request.args.get('short', 'true').lower() == 'true'
    service = get_inventory_item_service()
    items = service.get_all(is_short)
    return Response200.send(data=[item.__dict__ for item in items])



@inject
@authorized
def get_inventory_item(item_id):
    is_short = request.args.get('short', 'true').lower() == 'true'
    service = get_inventory_item_service()
    item = service.get_by_id(item_id, is_short)
    if not item:
        return Response404.send(message="Item not found")
    return Response200.send(data=item.__dict__)



@inject
@authorized
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