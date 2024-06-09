from flask import Flask, jsonify, request, make_response
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_jwt_extended import (JWTManager, create_access_token, jwt_required, get_jwt_identity, create_refresh_token, get_jwt)
from models import db, bcrypt, User, Book, Review, Genre, Recommendation, user_books
from datetime import timedelta
import os
import traceback

app = Flask(__name__)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

migrate = Migrate(app, db)
db.init_app(app)
bcrypt.init_app(app)
api = Api(app)
CORS(app, resources={r"*": {"origins": "*"}})
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
    @jwt_required(optional=True)
    def get(self, book_id):
        book = Book.query.get(book_id)
        if not book:
            return make_response(jsonify({"message": "Book not found"}), 404)

        book_dict = book.to_dict()

        user_id = get_jwt_identity()
        if user_id:
            user_book = db.session.query(user_books).filter_by(user_id=user_id, book_id=book_id).first()
            book_dict['user_rating'] = user_book.rating if user_book else None
        else:
            book_dict['user_rating'] = None

        return make_response(jsonify(book_dict), 200)

api.add_resource(BookDetail, '/books/<int:book_id>')


class Genres(Resource):
    def get(self):
        genres = Genre.query.all()
        response_dict_list = [genre.to_dict() for genre in genres]
        return make_response(jsonify(response_dict_list), 200)

api.add_resource(Genres, '/genres')


class Register(Resource):
    def post(self):
        try:
            data = request.get_json()
            print('Received registration data:', data)

            name = data.get('name')
            password = data.get('password')
            print(f'Name: {name}, Password: {password}')

            if not name or not password:
                print('Name or password not provided')
                return {"message": "Name and password are required"}, 400

            existing_user = User.query.filter_by(name=name).first()
            if existing_user:
                print('User already exists')
                return {"message": "User already exists"}, 400

            new_user = User(name=name)
            new_user.password_hash = password 
            print(f'New user created: {new_user}')

            db.session.add(new_user)
            db.session.commit()
            print('User committed to the database')

            return {"message": "User created successfully"}, 201
        except Exception as e:
            print(f"Error during registration: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            name = data.get('name')
            password = data.get('password')

            user = User.query.filter_by(name=name).first()
            if not user or not user.authenticate(password):
                return {"message": "Invalid username or password"}, 401

            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            return {"access_token": access_token, "refresh_token": refresh_token}, 200
        except Exception as e:
            print(f"Error during login: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

class TokenRefresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user_id)
        return {"access_token": new_access_token}, 200

api.add_resource(TokenRefresh, '/refresh', endpoint='refresh_endpoint')


class Protected(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        return {"name": user.name}, 200

api.add_resource(Register, '/register', endpoint='register_endpoint')
api.add_resource(Login, '/login', endpoint='login_endpoint')
api.add_resource(Protected, '/protected', endpoint='protected_endpoint')


class UserBooks(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        user_books_with_ratings = []

        for book in user.books:
            user_book = db.session.query(user_books).filter_by(user_id=user_id, book_id=book.id).first()
            user_books_with_ratings.append({
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'image_url': book.image_url,
                'rating': user_book.rating if user_book else None
            })

        return make_response(jsonify(user_books_with_ratings), 200)

    @jwt_required()
    def post(self):
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            book_id = data.get('bookId')
            rating = data.get('rating') 
            user = User.query.get(user_id)
            book = Book.query.get(book_id)

            if book in user.books:
                return make_response({"message": "Book already in list"}, 400)

            user.books.append(book)
            db.session.commit()

            user_book = db.session.query(user_books).filter_by(user_id=user_id, book_id=book_id).first()
            if user_book:
                db.session.execute(
                    user_books.update().
                    where(user_books.c.user_id == user_id).
                    where(user_books.c.book_id == book_id).
                    values(rating=rating)
                )
                db.session.commit()

            return make_response({"message": "Book added to list"}, 201)
        except Exception as e:
            traceback.print_exc()
            return make_response({"message": "Internal Server Error"}, 500)

    @jwt_required()
    def patch(self, book_id):
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            rating = data.get('rating')  # Getting the rating from the request data
            user_book = db.session.query(user_books).filter_by(user_id=user_id, book_id=book_id).first()

            if not user_book:
                return make_response({"message": "Book not in list"}, 400)

            db.session.execute(
                user_books.update().
                where(user_books.c.user_id == user_id).
                where(user_books.c.book_id == book_id).
                values(rating=rating)
            )
            db.session.commit()

            return make_response({"message": "Rating updated"}, 200)
        except Exception as e:
            traceback.print_exc()
            return make_response({"message": "Internal Server Error"}, 500)

    @jwt_required()
    def delete(self, book_id):
        try:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            book = Book.query.get(book_id)

            if book not in user.books:
                return make_response({"message": "Book not in list"}, 400)

            user.books.remove(book)
            db.session.commit()

            return make_response({"message": "Book removed from list"}, 200)
        except Exception as e:
            traceback.print_exc()
            return make_response({"message": "Internal Server Error"}, 500)

api.add_resource(UserBooks, '/user/books', '/user/books/<int:book_id>')



class Reviews(Resource):
    @jwt_required()
    def post(self):
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            book_id = data.get('book_id')
            review_body = data.get('review')

            user = User.query.get(user_id)
            book = Book.query.get(book_id)

            if not book:
                return {"message": "Book not found"}, 404

            existing_review = Review.query.filter_by(user_id=user_id, book_id=book_id).first()
            if existing_review:
                return {"message": "You have already reviewed this book"}, 400

            new_review = Review(body=review_body, user_id=user.id, book_id=book.id)
            db.session.add(new_review)
            db.session.commit()

            return {"message": "Review added successfully", "review": new_review.to_dict()}, 201
        except Exception as e:
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

api.add_resource(Reviews, '/reviews')



class UserReviews(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        user_reviews = [review.to_dict() for review in user.reviews]
        response = make_response(user_reviews, 200)
        return response

    @jwt_required()
    def delete(self, review_id):
        user_id = get_jwt_identity()
        review = Review.query.get(review_id)
        if review and review.user_id == user_id:
            db.session.delete(review)
            db.session.commit()
            return {"message": "Review deleted"}, 200
        return {"message": "Review not found or unauthorized"}, 404

    @jwt_required()
    def patch(self, review_id):
        user_id = get_jwt_identity()
        review = Review.query.get(review_id)
        if review and review.user_id == user_id:
            data = request.get_json()
            review.body = data.get('body', review.body)
            db.session.commit()
            return {"message": "Review updated"}, 200
        return {"message": "Review not found or unauthorized"}, 404

api.add_resource(UserReviews, '/user/reviews', '/user/reviews/<int:review_id>')


class Recommendations(Resource):
    def get(self):
        try:
            recommendations = Recommendation.query.all()
            response = make_response([rec.to_dict() for rec in recommendations], 200)
            return response
        except Exception as e:
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

    @jwt_required()
    def post(self):
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            new_recommendation = Recommendation(
                title=data.get('title'),
                author=data.get('author'),
                user_id=user_id
            )
            db.session.add(new_recommendation)
            db.session.commit()
            return make_response(new_recommendation.to_dict(), 201)
        except Exception as e:
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

api.add_resource(Recommendations, '/recommendations')


def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH')
    return response

if __name__ == '__main__':
    app.run(debug=True)
