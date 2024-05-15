from flask import Flask, request, jsonify
from models import Book, db
from flask_migrate import Migrate
from flask_restful import Api
import os
from flask_cors import CORS

app = Flask(__name__)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get(
    "DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)


@app.route('/')
def index():
    return 'Hello, World!'

@app.route('/api/books', methods=['POST'])
def create_book():
    data = request.get_json()
    new_book = Book(title=data['title'], author=data['author'], image_url=data['image_url'], genre_id=data['genre_id'])
    db.session.add(new_book)
    db.session.commit()
    return jsonify({'message': 'Book created successfully'}), 201

# Get all books
@app.route('/api/books', methods=['GET'])
def get_all_books():
    books = Book.query.all()
    return jsonify([book.serialize() for book in books])

# Get book by ID
@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = Book.query.get_or_404(book_id)
    return jsonify(book.serialize())

# Update book by ID
@app.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    book = Book.query.get_or_404(book_id)
    data = request.get_json()
    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.image_url = data.get('image_url', book.image_url)
    book.genre_id = data.get('genre_id', book.genre_id)
    db.session.commit()
    return jsonify({'message': 'Book updated successfully'})

# Delete book by ID
@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({'message': 'Book deleted successfully'})


if __name__ == '__main__':
    app.run(port=5555, debug=True)