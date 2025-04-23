from backend.configurations.flask_utils import authorized, Response200

@authorized
def get_logs(service):
    logs = service.get_all()
    return Response200.send(data=[log.__dict__ for log in logs])