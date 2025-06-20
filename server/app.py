from flask import Flask, jsonify, make_response
from flask_restful import Resource
from config import app, db, api
from models import User, Tool, Review, Booking

@app.route('/')
def home():
    return '<h1>ToolShare API</h1>'

class Tools(Resource):
    def get(self):
        tools = [tool.to_dict() for tool in Tool.query.all()]
        return make_response(jsonify(tools), 200)

api.add_resource(Tools, '/tools')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
