from appone.extensions import db

class Products(db.Model):
    __tablename__='products'
    
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(30))
    price = db.Column(db.Float,nullable = False)
    description = db.Column(db.String(100))

