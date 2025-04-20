from functools import wraps
from flask import jsonify, request
from typing import Any, Optional, Dict, Union, List
from services.security import validate_jwt_token


class BaseResponse:
    @classmethod
    def _build_response(
            cls,
            data: Optional[Union[Dict, List, str]] = None,
            message: Optional[str] = None,
            errors: Optional[List] = None,
            meta: Optional[Dict] = None
    ) -> Dict:
        response = {}
        if data is not None:
            response['data'] = data
        if message:
            response['message'] = message
        if errors:
            response['errors'] = errors
        if meta:
            response['meta'] = meta
        return response


class Response200(BaseResponse):
    @staticmethod
    def send(
            data: Optional[Union[Dict, List, Any]] = None,
            message: Optional[str] = None,
            meta: Optional[Dict] = None
    ):
        response = Response200._build_response(data=data, message=message, meta=meta)
        return jsonify(response), 200


class Response201(BaseResponse):
    @staticmethod
    def send(
            data: Optional[Union[Dict, List, Any]] = None,
            message: Optional[str] = "Resource created successfully",
            meta: Optional[Dict] = None
    ):
        response = Response201._build_response(data=data, message=message, meta=meta)
        return jsonify(response), 201


class Response204(BaseResponse):
    @staticmethod
    def send():
        return '', 204


class Response400(BaseResponse):
    @staticmethod
    def send(
            message: str = "Bad request",
            errors: Optional[List] = None,
            data: Optional[Union[Dict, List, Any]] = None
    ):
        response = Response400._build_response(
            message=message,
            errors=errors,
            data=data
        )
        return jsonify(response), 400


class Response401(BaseResponse):
    @staticmethod
    def send(
            message: str = "Unauthorized",
            errors: Optional[List] = None
    ):
        response = Response401._build_response(
            message=message,
            errors=errors
        )
        return jsonify(response), 401


class Response403(BaseResponse):
    @staticmethod
    def send(
            message: str = "Forbidden",
            errors: Optional[List] = None
    ):
        response = Response403._build_response(
            message=message,
            errors=errors
        )
        return jsonify(response), 403


class Response404(BaseResponse):
    @staticmethod
    def send(
            message: str = "Resource not found",
            errors: Optional[List] = None
    ):
        response = Response404._build_response(
            message=message,
            errors=errors
        )
        return jsonify(response), 404


class Response500(BaseResponse):
    @staticmethod
    def send(
            message: str = "Internal server error",
            errors: Optional[List] = None
    ):
        response = Response500._build_response(
            message=message,
            errors=errors
        )
        return jsonify(response), 500

def authorized(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        jwt_token = validate_jwt_token(request.cookies.get('jwt'))
        if jwt_token is None:
            return Response401.send()
        return f(*args, **kwargs)
    return decorated_function