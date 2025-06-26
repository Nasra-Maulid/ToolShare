from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

app = Flask(__name__)

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Set naming conventions for Alembic
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

# Initialize extensions
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)

# ✅ Allow CORS from both local and deployed frontend
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "https://toolshare-frontend.onrender.com"
        ]
    }
})

# Import models to register them with SQLAlchemy
from models import User, Tool, Review, Booking
