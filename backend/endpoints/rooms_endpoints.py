from backend.configurations.flask_utils import authorized, Response200, Response404, Response400, Response201
from flask import request

@authorized
def get_rooms(service):
    rooms = service.get_all()
    return Response200.send(data=[room.__dict__ for room in rooms])

@authorized
def get_room(room_id, service):
    room = service.get_by_id(room_id)
    if not room:
        return Response404.send(message="Room not found")
    return Response200.send(data=room.__dict__)

@authorized
def create_room(service):
    if not request.is_json:
        return Response400.send(message="Request must be JSON")

    try:
        data = request.json
        if not data.get('name') or not data.get('short_name'):
            return Response400.send(message="Name and short_name are required")

        room_id = service.create(data.get('name'), data.get('short_name'))
        if not room_id:
            return Response400.send(message="Room creation failed")
        return Response201.send(data={"id": room_id})
    except Exception as e:
        return Response400.send(message=str(e))