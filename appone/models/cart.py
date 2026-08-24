from appone.extensions import db


class Cart(db.Model):
    id = db.column(db.Integer,primary_key = True)

    user_id = db.column(db.Integer,
                        db.ForeignKey("User5.id"),
                        nulleble = False )

    product_id = db.column(db.Integer,
                         db.ForeignKey("Product.id"),
                         nulleble = False )

    quantity = db.column(db.Integer,
                         nullble = False,
                         default = 1
                         )

    created_at = db.column(db.DateTime,
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