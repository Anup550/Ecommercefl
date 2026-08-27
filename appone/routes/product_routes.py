from flask import request,jsonify,session,Blueprint
from appone.models.product import Products
from appone.extensions import db

productbp = Blueprint("product_routes",__name__)

@productbp.route("/products",methods = ["POST"])
def create_products():
    data  = request.get_json()
    name = data.get("name")
    price = data.get("price")
    description = data.get("description")
    if not name:
        return jsonify(msg = "name is required"),400
    if not price:
        return jsonify(msg = "name is required"),400
    if not price:
        return jsonify(msg ="price is required"),400
        
    obj = Products(name = name,price = price,description = description)
    db.session.add(obj)
    db.session.commit()
    return jsonify({"msg" :"products added sucessfully ",
                    "product_id":obj.id}),201



@productbp.route("/products",methods = ["GET"])
def get_products():
    products = Products.query.all()
    return jsonify([{
           "id":product.id,
           "name":product.name,
           "price":product.price,
           "description":product.description
                   }
            for product in products
                   ]),200


