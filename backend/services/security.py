from datetime import datetime, timedelta
import hashlib
import jwt
from backend.configurations.config import SECRET_KEY, ALGORITHM, DEFAULT_JWT_EXPIRES_HOURS


def create_jwt_token(data: dict, expires_delta_hours: timedelta = None) -> str:
    """
    Создает JWT токен с указанными данными и сроком действия
    """
    to_encode = data.copy()

    if expires_delta_hours:
        expire = datetime.utcnow() + expires_delta_hours
    else:
        expire = datetime.utcnow() + timedelta(hours=DEFAULT_JWT_EXPIRES_HOURS)

    to_encode.update({'exp': expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def validate_jwt_token(token: str) -> dict:
    """
    Валидирует JWT токен и возвращает его payload
    """
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise ValueError('Token expired')
    except jwt.InvalidTokenError:
        raise ValueError('Token invalid')


def hash_data(data: str) -> str:
    """
    Хеширует данные с помощью SHA-256
    """
    return hashlib.sha256(data.encode('utf-8')).hexdigest()