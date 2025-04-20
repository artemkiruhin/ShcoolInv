from dependency_injector.wiring import inject
from configurations.dependency_injection import get_log_service
from configurations.flask_utils import authorized, Response200


@inject
@authorized
def get_logs():
    service = get_log_service()
    logs = service.get_all()
    return Response200.send(data=[log.__dict__ for log in logs])