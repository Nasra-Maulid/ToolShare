from flask import Flask, jsonify, make_response, request
from flask_restful import Resource, reqparse
from config import app, db, api
from models import User, Tool, Review, Booking

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

# Root route
@app.route('/')
def home():
    return '<h1>ToolShare API</h1>'

# Register resources
api.add_resource(Tools, '/tools')
api.add_resource(ToolById, '/tools/<int:id>')

# Run app
if __name__ == '__main__':
    app.run(port=5555, debug=True)
