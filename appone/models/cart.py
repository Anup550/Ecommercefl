from appone.extensions import db


class Cart(db.Model):
    __tablename__="carts"

    id = db.Column(db.Integer,primary_key = True)

    user_id = db.Column(db.Integer,
                        db.ForeignKey("users.id"),
                        nullable = False )

    product_id = db.Column(db.Integer,
                         db.ForeignKey("products.id"),
                         nullable = False )

    quantity = db.Column(db.Integer,
                         nullable = False,
                         default = 1
                         )

    created_at = db.Column(db.DateTime,
                           server_default=db.func.now()
                           )


    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
                          )




    user = db.relationship(
        "User5",
        backref="cart_items"
    )

    product = db.relationship(
        "Products",
        backref="cart_items"
    )