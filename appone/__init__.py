from flask import Flask
from appone.config import Config
from appone.routes import user_routes
from appone.extensions import db,jwt,auth,cache
from flasgger import Swagger


def create_app():
    app = Flask(__name__)
    
    app.config.from_object(Config)
    db.init_app(app)
    jwt.init_app(app)
    auth.init_app(app)
    cache.init_app(app)
    from appone.routes import user_routes
    app.register_blueprint(user_routes.bp)
    Swagger(app)

    return app







