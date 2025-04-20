from http.client import responses
from dependency_injector.wiring import inject
from flask import Flask, request, jsonify
from dependency_injection import Container, get_user_service, container
from services import  *
from security import *
from config import SessionLocal, DEFAULT_JWT_EXPIRES_SECONDS
from flask_utils import Response400, Response401, Response200, Response204

app = Flask(__name__)
app.container = container
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_SECRET_KEY'] = SECRET_KEY


@app.route("/auth/login", methods=['POST'])
@inject
def login():
    if not request.is_json:
        return Response400.send("Missing credentials")

    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not username or not password: return Response400.send("Missing credentials")

    service = get_user_service()
    password_hash = hash_data(password)
    login_dto = service.login(username, password_hash)
    if not login_dto or not login_dto.jwt or not login_dto.user_data: return Response401.send("Invalid username or password")

    response = jsonify({'data': login_dto.user_data})
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
    return Response204.send() if jwt_token else Response401.send('Invalid JWT Token')


@app.route("/auth/logout", methods=['GET'])
def logout():
    response = Response204.send()
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


if __name__ == "__main__":
    container.wire(modules=[__name__])
    import uvicorn
    uvicorn.run(app, port=5123, host='localhost')