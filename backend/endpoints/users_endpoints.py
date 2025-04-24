from backend.core.dtos import UserCreateDTO
from backend.configurations.flask_utils import authorized, Response200, Response500, Response404, Response400, Response201
from backend.services.security import hash_data
from flask import request

from backend.services.services import UserService


@authorized
def get_users(service):
    try:
        users = service.get_all()
        return Response200.send(data=[user.__dict__ for user in users])
    except Exception as e:
        return Response500.send(message=str(e))

@authorized
def get_user(user_id, service):
    user = service.get_by_id(user_id)
    if not user:
        return Response404.send(message="User not found")
    return Response200.send(data=user.__dict__)

@authorized
def create_user(service):
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

        user = service.create(dto)
        if not user:
            return Response400.send(message="User creation failed")
        return Response201.send(data=user.__dict__)
    except Exception as e:
        return Response400.send(message=str(e))

def init(service: UserService):
    try:
        dto = UserCreateDTO(
            username='admin2',
            password_hash=hash_data('1'),
            email='a2min@mail.ru',
            full_name='Иванов Сергей Витальевич',
            phone_number='43991112233',
            is_admin=True,
            avatar=None
        )

        user = service.create(dto)
        if not user:
            return Response400.send(message="User creation failed")
        return Response201.send(data=user.id)
    except Exception as e:
        print(e)
        return Response400.send(message=str(e))