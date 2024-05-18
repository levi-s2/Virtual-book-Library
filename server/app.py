from flask import Flask, jsonify, request, make_response
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource
import os
from models import db

app = Flask(__name__)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get(
    "DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)
CORS(app)

# Import models after db initialization
from models import Book


class Home(Resource):

    def get(self):

        response_dict = {
            "message": "Book store API",
        }

        response = make_response(
            response_dict,
            200
        )

        return response

api.add_resource(Home, '/')


class Books(Resource):
    def get(self):

        response_dict_list = [book.to_dict() for book in Book.query.all()]

        response = make_response(
            response_dict_list,
            200,
        )
        return response

api.add_resource(Books, '/books')


if __name__ == '__main__':
    app.run(debug=True)
    