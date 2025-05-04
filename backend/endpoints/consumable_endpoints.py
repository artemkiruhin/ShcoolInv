from backend.configurations.flask_utils import authorized, Response200, Response400, Response201, Response500
from flask import request


@authorized
def get_consumables(service):
    consumables = service.get_all()
    return Response200.send(data=[consumable.__dict__ for consumable in consumables])

@authorized
def create_consumable(service):
    data = request.json
    required_fields = ['name', 'description', 'quantity']
    if not all(field in data for field in required_fields):
        return Response400.send(message=f"Required fields: {', '.join(required_fields)}")
    result = service.create(data['name'], data['description'], data['quantity'])
    return Response201.send(data=result) if result is not None else Response500.send()

@authorized
def delete_consumable(condition_id: int, service):
    result = service.delete(condition_id)
    return Response200.send(data=result) if result else Response500.send()

@authorized
def update_consumable(service):
    data = request.json
    required_fields = ['consumable_id', 'name', 'description', 'quantity']
    if not all(field in data for field in required_fields):
        return Response400.send(message=f"Required fields: {', '.join(required_fields)}")
    result = service.update(data['consumable_id'], data['name'], data['description'], data['quantity'])
    return Response200.send(data=result) if result is not None else Response500.send()