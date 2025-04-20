from dependency_injector.wiring import inject

from configurations.dependency_injection import get_user_service
from core.dtos import UserCreateDTO
from configurations.flask_utils import authorized, Response200, Response500, Response404, Response400, Response201
from services.security import hash_data
from flask import request


@inject
@authorized
def get_users():
    try:
        service = get_user_service()
        users = service.get_all()
        return Response200.send(data=[user.__dict__ for user in users])
    except Exception as e:
        return Response500.send(message=str(e))



@inject
@authorized
def get_user(user_id):
    service = get_user_service()
    user = service.get_by_id(user_id)
    if not user:
        return Response404.send(message="User not found")
    return Response200.send(data=user.__dict__)



@inject
@authorized
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
