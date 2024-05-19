from flask import Flask, jsonify, request, make_response
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, bcrypt, User, Book, Review, Genre, user_books
import os

app = Flask(__name__)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Change this in a real app

migrate = Migrate(app, db)
db.init_app(app)
bcrypt.init_app(app)
api = Api(app)
CORS(app)
jwt = JWTManager(app)

class Home(Resource):
    def get(self):
        response_dict = {"message": "Book store API"}
        response = make_response(response_dict, 200)
        return response

api.add_resource(Home, '/')

class Books(Resource):
    def get(self):
        response_dict_list = [book.to_dict() for book in Book.query.all()]
        response = make_response(response_dict_list, 200)
        return response

api.add_resource(Books, '/books')

class BookDetail(Resource):
    def get(self, book_id):
        book = Book.query.get(book_id)
        if book:
            return make_response(jsonify(book.to_dict()), 200)
        else:
            return make_response(jsonify({"message": "Book not found"}), 404)

api.add_resource(BookDetail, '/books/<int:book_id>')

class Register(Resource):
    def post(self):
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')

        if User.query.filter_by(name=name).first():
            return jsonify({"message": "User already exists"}), 400

        new_user = User(name=name)
        new_user.password_hash = password  # Use the password_hash property to hash the password
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201

api.add_resource(Register, '/register')

class Login(Resource):
    def post(self):
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')

        user = User.query.filter_by(name=name).first()

        if user and user.authenticate(password):
            access_token = create_access_token(identity=user.id)
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401

api.add_resource(Login, '/login')

class UserBooks(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        user_books = [book.to_dict() for book in user.books]
        return jsonify(user_books), 200

api.add_resource(UserBooks, '/user/books')

if __name__ == '__main__':
    app.run(debug=True)