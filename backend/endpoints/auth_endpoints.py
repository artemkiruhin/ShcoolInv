from dependency_injector.wiring import inject

from config import DEFAULT_JWT_EXPIRES_SECONDS
from dependency_injection import get_user_service
from flask_utils import Response204, Response200, Response401, Response400
from security import hash_data
from flask import request

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



def validate():
    return Response204.send()



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