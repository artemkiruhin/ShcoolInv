from flask import Flask

from dependency_injection import container
from security import *

app = Flask(__name__)
app.container = container
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_SECRET_KEY'] = SECRET_KEY


if __name__ == "__main__":
    container.wire(modules=[__name__])
    import uvicorn
    uvicorn.run(app, port=5123, host='localhost')