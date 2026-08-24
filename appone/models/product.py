from appone.extensions import db

class Products(db.Model):
    id = db.column(db.Integer,primary_key = True)
    name = db.column(db.String(30))
    price = db.column(db.String(30))
    description = db.column(db.String(100))

