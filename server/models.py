from flask_bcrypt import Bcrypt
from config import db
from sqlalchemy_serializer import SerializerMixin

bcrypt = Bcrypt()  # Instantiate Bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    is_admin = db.Column(db.Boolean, default=False)  # ✅ Already included

    # Relationships
    tools = db.relationship('Tool', backref='owner')
    reviews = db.relationship('Review', backref='user')
    bookings = db.relationship('Booking', backref='user')

    # Serializer rules
    serialize_rules = ('-password_hash', '-tools.owner', '-reviews.user', '-bookings.user')

    # Password setter
    @property
    def password(self):
        raise AttributeError('Password is not readable')

    @password.setter
    def password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


class Tool(db.Model, SerializerMixin):
    __tablename__ = 'tools'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    daily_rate = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String)
    available = db.Column(db.Boolean, default=True)

    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    reviews = db.relationship('Review', backref='tool')
    bookings = db.relationship('Booking', backref='tool')

    serialize_rules = ('-owner.tools', '-reviews.tool', '-bookings.tool')


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    tool_id = db.Column(db.Integer, db.ForeignKey('tools.id'))

    serialize_rules = ('-user.reviews', '-tool.reviews')


class Booking(db.Model, SerializerMixin):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String, default='pending')

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    tool_id = db.Column(db.Integer, db.ForeignKey('tools.id'))

    serialize_rules = ('-user.bookings', '-tool.bookings')
