from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_basicauth import BasicAuth
from flask_caching import Cache

db = SQLAlchemy()
jwt = JWTManager()
auth = BasicAuth()
cache = Cache()