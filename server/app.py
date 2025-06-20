from flask import jsonify, make_response
from flask_restful import Resource
from config import app, db, api
from models import Tool

# Root route to test server is running
@app.route('/')
def home():
    return '<h1>ToolShare API</h1>'

# Resource for handling /tools
class Tools(Resource):
    def get(self):
        print("GET /tools called")  # 👈 Add this
        tools = [tool.to_dict() for tool in Tool.query.all()]
        return make_response(jsonify(tools), 200)

# Register the /tools route
api.add_resource(Tools, '/tools')

# Run the app
if __name__ == '__main__':
    app.run(port=5555, debug=True)
