
from datetime import timedelta
class Config:
    SQLALCHEMY_DATABASE_URI ="mysql://root:Anup123@localhost/demoflask2"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=30)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)
    JWT_SECRET_KEY = "this is jwt secret key"
    BASIC_AUTH_USERNAME = "python"
    BASIC_AUTH_PASSWORD = "flask"
    SECRET_KEY = "this is secret key"

    # CACHE_TYPE = "SimpleCache"
    CACHE_DIR =  "cache_dir"
    CACHE_TYPE = "FileSystemCache" 
    CACHE_DEFAULT_TIMEOUT = 60