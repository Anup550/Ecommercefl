from flask import request,jsonify,session,Blueprint
from appone.models.cart import Cart
from appone.extensions import db


cartbp = Blueprint("cart_routes",__name__)

@cartbp.route("/cart",methods = ["POST"])
def cart():
    data = request.get_json()
    user_id = data.get("user_id")
    product_id = data.get("product_id")
    quantity = data.get("quantity",1)

    if not user_id:
        return jsonify(msg="user_id is required"), 400
    if not product_id:
        return jsonify(msg = "product_id is required"),400
    if quantity <=0:
        return jsonify(msg = "quantity must be greater than 0"),400

    cart_item = Cart(user_id = user_id,product_id = product_id,quantity = quantity)

    db.session.add(cart_item)
    db.session.commit()
    return jsonify(
        msg="Product added to cart successfully"
    ), 201


@cartbp.route("/cart", methods = ["GET"])
def get_cart_products():
    carts = Cart.query.all()
    return jsonify([{
        "id":cart.id,
        "user_id":cart.user_id,
        "product_id":cart.product_id,
        "name":cart.product.name,
        "price":cart.product.price,
        "description":cart.product.description,
        "quantity":cart.quantity
            }
         for cart in carts

            ]),200
