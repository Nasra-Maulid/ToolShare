from flask import Flask, jsonify, make_response, request
from flask_restful import Resource, reqparse
from flask_bcrypt import Bcrypt
from config import app, db, api
from models import User, Tool, Review, Booking, bcrypt

# Helper function for error handling
def error_response(message, status_code):
    return make_response(jsonify({"error": message}), status_code)

# Tools Resource
class Tools(Resource):
    def get(self):
        tools = [tool.to_dict() for tool in Tool.query.all()]
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
        tool = Tool.query.get(id)
        if not tool:
            return error_response("Tool not found", 404)
        return make_response(jsonify(tool.to_dict()), 200)

    def patch(self, id):
        tool = Tool.query.get(id)
        if not tool:
            return error_response("Tool not found", 404)
        
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('description', type=str)
        parser.add_argument('daily_rate', type=float)
        parser.add_argument('image_url', type=str)
        parser.add_argument('available', type=bool)
        
        args = parser.parse_args()
        
        for key, value in args.items():
            if value is not None:
                setattr(tool, key, value)
        
        db.session.commit()
        return make_response(jsonify(tool.to_dict()), 200)

    def delete(self, id):
        tool = Tool.query.get(id)
        if not tool:
            return error_response("Tool not found", 404)
        
        db.session.delete(tool)
        db.session.commit()
        return make_response(jsonify({"message": "Tool deleted"}), 200)

# Auth Resources
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
            password=args['password']  # Assumes hashing happens in the User model
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return make_response(jsonify(new_user.to_dict()), 201)

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

# Root route
@app.route('/')
def home():
    return '<h1>ToolShare API</h1>'

# Register resources
api.add_resource(Tools, '/tools')
api.add_resource(ToolById, '/tools/<int:id>')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Bookings, '/bookings')


# Run app
if __name__ == '__main__':
    app.run(port=5555, debug=True)
