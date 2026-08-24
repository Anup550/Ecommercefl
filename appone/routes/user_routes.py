import time
from flask import jsonify,request,session,Blueprint
from appone.models.user import User5
from appone.extensions import db,jwt,auth,cache
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity,create_refresh_token

bp = Blueprint("user",__name__)

@bp.route("/protected",methods = ["GET"])
@jwt_required()
def pro_route():
    return jsonify(msg = f"{get_jwt_identity()}accessing protected route")

@bp.route("/register", methods=["POST"])
def register():
    """
    Register a new user
    ---
    tags:
      - Users

    consumes:
      - application/json

    parameters:
      - in: body
        name: body
        required: true
        description: User registration details
        schema:
          type: object
          required:
            - username
            - password
          properties:
            username:
              type: string
              example: anup
            password:
              type: string
              example: 12345

    responses:
      200:
        description: User registered successfully
        schema:
          type: object
          properties:
            msg:
              type: string
              example: user name and password registered successfully

      400:
        description: Invalid request or username already exists
        schema:
          type: object
          properties:
            msg:
              type: string
              example: please provide data
    """

    # Get JSON data from request
    data = request.get_json(silent=True)

    # Check whether data was provided
    if not data:
        return jsonify(
            msg="please provide data"
        ), 400

    # Get username and password
    username = data.get("username")
    password = data.get("password")

    # Check required fields
    if not username or not password:
        return jsonify(
            msg="username and password are required"
        ), 400

    # Check whether username already exists
    user_obj = User5.query.filter_by(
        username=username
    ).first()

    if user_obj:
        return jsonify(
            msg="the user name already exists"
        ), 400

    # Create new user object
    obj = User5(
        username=username,
        password=password
    )

    # Add user to database session
    db.session.add(obj)

    # Save user permanently in database
    db.session.commit()

    # Send response
    return jsonify(
        msg="user name and password registered successfully"
    ), 200


@bp.route("/login", methods=["POST"])
def login():
    """
    Login user and generate JWT tokens
    ---
    tags:
      - Users
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - username
            - password
          properties:
            username:
              type: string
              example: anup
            password:
              type: string
              example: 12345
    responses:
      200:
        description: Login successful
        schema:
          type: object
          properties:
            msg:
              type: string
              example: login successfully
            access_token:
              type: string
              example: eyJhbGciOiJIUzI1NiIs...
            refrash_token:
              type: string
              example: eyJhbGciOiJIUzI1NiIs...
      400:
        description: Invalid username or password
        schema:
          type: object
          properties:
            msg:
              type: string
              example: provide valid details
    """

    data = request.get_json(silent=True)

    if not data:
        return jsonify(
            msg="please provide data"
        ), 400

    user_obj = User5.query.filter_by(
        username=data["username"],
        password=data["password"]
    ).first()

    if not user_obj:
        return jsonify(
            msg="provide valid details"
        ), 400

    acc_token = create_access_token(
        identity=data["username"]
    )

    refrash_token = create_refresh_token(
        identity=data["username"]
    )

    return jsonify(
        msg="login successfully",
        access_token=acc_token,
        refrash_token=refrash_token
    ), 200

# 🔄 Refresh Route (NEW ACCESS TOKEN using refresh token)
@bp.route("/refrash",methods = ["POST"])
@jwt_required(refresh=True)
def refrash():

        """
    Generate a new access token using a refresh token
    ---
    tags:
      - Authentication

    securityDefinitions:
      Bearer:
        type: apiKey
        name: Authorization
        in: header

    security:
      - Bearer: []

    responses:
      200:
        description: New access token generated successfully
        schema:
          type: object
          properties:
            new_access_token:
              type: string
              example: eyJhbGciOiJIUzI1NiIs...

    401:
     description: Invalid or expired refresh token
    schema:
          type: object
          properties:
            msg:
              type: string
              example: Missing Authorization Header
    """

        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        return jsonify(new_access_token = new_access_token),200
#------------------------------------------------------------------
# @bp.route("/basiclogin")
# @auth.required
# def basic_login():
#     return jsonify (msg = "user login using basic auth")
#--------------------------------------------------------------------------------

# sessions

@bp.route("/basiclogin")
@auth.required
def basic_login():
    session["is_logged_in"]= True
    return jsonify (msg = "user login using basic auth")
#---------------------------------------------------------------
@bp.route("/check_for_session")
def check():
    if session.get('is_logged_in'):
        return jsonify (msg = "user still login")
    return jsonify (msg = "user logout")
#----------------------------------------------------------------
@bp.route("/logout")
def logout():
    res = session.pop('is_logged_in',None)
    return jsonify (msg = "user logout")
#-----------------------------------------------------------------
# cookies

@bp.route("/search/<item>")
def searched_item(item):
    res = jsonify(msg = f"user searches this item  {item} ")
    res.set_cookie("search_item",item)
    return res

@bp.route('/get_cookies')
def feached_item():
    res = request.cookies.get("search_item")
    if res:
        return jsonify(msg = f"fetching the searched  product - {res}")
    return jsonify(msg = f"no cookis found")

@bp.route("/deleate_cookie")
def delete_cooke():
    res1 = jsonify(msg = "cookies deleted")
    res1.delete_cookie("search_item")
    return res1

#---------------------------------------------------
#   How to Set Cookie Expiry Time

# You can control how long cookie stays using

@bp.route("/search1/<item>")
def searched_item1(item):
    res = jsonify(msg=f"user searches this item {item}")
    
    res.set_cookie("search_item", item, max_age=10)  #  10 sec  60 >>> 1 minu    
    return res

#-------------------------------------------------------------------------------------------------
@bp.route("/simple_cache")
@cache.cached()
def simple_cache():
    time.sleep(5)
    print("*"*20)
    return jsonify(msg = "frp,simplecache")


@bp.route("/file_cache")
@cache.cached()
def file_cache():
    time.sleep(5)
    print("*"*20)
    return jsonify(msg = "from file cache")




