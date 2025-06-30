import os
from flask import Flask, jsonify, make_response, request
from flask_restful import Resource, reqparse
from flask_cors import CORS
from config import app, db, api
from models import User, Tool, Review, Booking, bcrypt
import re

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# Helper function for consistent error responses
def error_response(message, status_code):
    return make_response(jsonify({"error": message}), status_code)

# Tools Resource
class Tools(Resource):
    def get(self):
        search = request.args.get('search')
        max_price = request.args.get('max_price')

        query = Tool.query

        if search:
            query = query.filter(Tool.name.ilike(f'%{search}%'))
        if max_price:
            query = query.filter(Tool.daily_rate <= float(max_price))

        tools = [tool.to_dict() for tool in query.all()]
        return make_response(jsonify(tools), 200)

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True, help="Name is required")
        parser.add_argument('description', type=str)
        parser.add_argument('daily_rate', type=float, required=True, help="Daily rate is required")
        parser.add_argument('image_url', type=str)
        parser.add_argument('owner_id', type=int, required=True, help="Owner ID is required")
        
        args = parser.parse_args()

        new_tool = Tool(
            name=args['name'],
            description=args['description'],
            daily_rate=args['daily_rate'],
            image_url=args['image_url'],
            owner_id=args['owner_id']
        )

        db.session.add(new_tool)
        db.session.commit()

        return make_response(jsonify(new_tool.to_dict()), 201)

# Tool by ID Resource
class ToolById(Resource):
    def get(self, id):
        tool = db.session.get(Tool, id)  # Using get() instead of query.get()
        if not tool:
            return error_response("Tool not found", 404)
        
        tool_data = tool.to_dict()
        
        # Add additional data
        tool_data['reviews_count'] = len(tool.reviews)
        tool_data['average_rating'] = (
            sum(r.rating for r in tool.reviews) / len(tool.reviews) 
            if tool.reviews else 0
        )
        
        return make_response(jsonify(tool_data), 200)

    def patch(self, id):
        tool = db.session.get(Tool, id)
        if not tool:
            return error_response("Tool not found", 404)

        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('description', type=str)
        parser.add_argument('daily_rate', type=float)
        parser.add_argument('image_url', type=str)
        parser.add_argument('available', type=bool)
        parser.add_argument('category', type=str)

        args = parser.parse_args()

        try:
            for key, value in args.items():
                if value is not None:
                    setattr(tool, key, value)
            
            db.session.commit()
            return make_response(jsonify(tool.to_dict()), 200)
        except Exception as e:
            db.session.rollback()
            return error_response(str(e), 400)

    def delete(self, id):
        tool = db.session.get(Tool, id)
        if not tool:
            return error_response("Tool not found", 404)

        try:
            db.session.delete(tool)
            db.session.commit()
            return make_response(jsonify({"message": "Tool deleted"}), 200)
        except Exception as e:
            db.session.rollback()
            return error_response(str(e), 500)
# Signup Resource
class Signup(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str, required=True)
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('password', type=str, required=True)

        args = parser.parse_args()

        new_user = User(
            username=args['username'],
            email=args['email'],
            password=args['password']  # Assume User model hashes it
        )

        db.session.add(new_user)
        db.session.commit()

        return make_response(jsonify(new_user.to_dict()), 201)

# Login Resource
class Login(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str, required=True)
        parser.add_argument('password', type=str, required=True)

        args = parser.parse_args()

        user = User.query.filter_by(username=args['username']).first()

        if not user or not user.authenticate(args['password']):
            return error_response("Invalid credentials", 401)

        return make_response(jsonify(user.to_dict()), 200)

# Bookings Resource
class Bookings(Resource):
    def get(self):
        user_id = request.args.get('user_id')
        tool_id = request.args.get('tool_id')

        query = Booking.query

        if user_id:
            query = query.filter_by(user_id=user_id)
        if tool_id:
            query = query.filter_by(tool_id=tool_id)

        bookings = [booking.to_dict() for booking in query.all()]
        return make_response(jsonify(bookings), 200)

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('tool_id', type=int, required=True)
        parser.add_argument('user_id', type=int, required=True)
        parser.add_argument('start_date', type=str, required=True)
        parser.add_argument('end_date', type=str, required=True)

        args = parser.parse_args()

        new_booking = Booking(
            tool_id=args['tool_id'],
            user_id=args['user_id'],
            start_date=args['start_date'],
            end_date=args['end_date']
        )

        db.session.add(new_booking)
        db.session.commit()

        return make_response(jsonify(new_booking.to_dict()), 201)

# Reviews Resource
class Reviews(Resource):
    def get(self):
        tool_id = request.args.get('tool_id')
        user_id = request.args.get('user_id')

        query = Review.query

        if tool_id:
            query = query.filter_by(tool_id=tool_id)
        if user_id:
            query = query.filter_by(user_id=user_id)

        reviews = [review.to_dict() for review in query.all()]
        return make_response(jsonify(reviews), 200)

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('tool_id', type=int, required=True)
        parser.add_argument('user_id', type=int, required=True)
        parser.add_argument('rating', type=int, required=True)
        parser.add_argument('comment', type=str)

        args = parser.parse_args()

        if args['rating'] < 1 or args['rating'] > 5:
            return error_response("Rating must be between 1-5", 400)

        new_review = Review(
            tool_id=args['tool_id'],
            user_id=args['user_id'],
            rating=args['rating'],
            comment=args['comment']
        )

        db.session.add(new_review)
        db.session.commit()

        return make_response(jsonify(new_review.to_dict()), 201)

# Admin Tools Resource
class AdminTools(Resource):
    def get(self):
        user_id = request.args.get('user_id')
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return error_response("Unauthorized", 403)

        tools = Tool.query.all()
        return make_response(jsonify([tool.to_dict() for tool in tools]), 200)

    def delete(self, id):
        user_id = request.args.get('user_id')
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return error_response("Unauthorized", 403)

        tool = Tool.query.get(id)
        if not tool:
            return error_response("Tool not found", 404)

        db.session.delete(tool)
        db.session.commit()
        return make_response(jsonify({"message": "Tool deleted"}), 200)

# Root route
@app.route('/')
def home():
    return '<h1>ToolShare API</h1>'

# @app.route('/tools/featured')
# def featured_tools():
#     tools = Tool.query.filter_by(featured=True).limit(4).all()
#     return jsonify([tool.to_dict() for tool in tools])

# @app.route('/tools')
# def get_tools():
#     search = request.args.get('search')
#     category = request.args.get('category')
#     min_price = request.args.get('min_price')
#     max_price = request.args.get('max_price')
    
#     query = Tool.query
    
#     if search:
#         query = query.filter(Tool.name.ilike(f'%{search}%'))
#     if category:
#         query = query.filter_by(category=category)
#     if min_price:
#         query = query.filter(Tool.daily_rate >= float(min_price))
#     if max_price:
#         query = query.filter(Tool.daily_rate <= float(max_price))
        
#     tools = query.all()
#     return jsonify([tool.to_dict() for tool in tools])

# @app.route('/signup', methods=['POST'])
# def signup():
#     data = request.get_json()
    
#     # Validate required fields
#     required_fields = ['username', 'email', 'password']
#     if not all(field in data for field in required_fields):
#         return jsonify({'error': 'Missing required fields'}), 400
    
#     # Validate email format
#     if not re.match(r"[^@]+@[^@]+\.[^@]+", data['email']):
#         return jsonify({'error': 'Invalid email format'}), 400
    
#     # Check if user exists
#     if User.query.filter_by(username=data['username']).first():
#         return jsonify({'error': 'Username already exists'}), 400
#     if User.query.filter_by(email=data['email']).first():
#         return jsonify({'error': 'Email already registered'}), 400
    
#     try:
#         new_user = User(
#             username=data['username'],
#             email=data['email'],
#             password_hash=bcrypt.generate_password_hash(data['password']).decode('utf-8')
#         )
        
#         db.session.add(new_user)
#         db.session.commit()
        
#         return jsonify({
#             'id': new_user.id,
#             'username': new_user.username,
#             'email': new_user.email
#         }), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': 'Registration failed'}), 500
    
# Register resources
api.add_resource(Tools, '/tools')
api.add_resource(ToolById, '/tools/<int:id>')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Bookings, '/bookings')
api.add_resource(Reviews, '/reviews')
api.add_resource(AdminTools, '/admin/tools', '/admin/tools/<int:id>')

# Run app
if __name__ == '__main__':
    app.run(port=5555, debug=True)
