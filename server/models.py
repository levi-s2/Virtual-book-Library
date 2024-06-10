from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin
from flask_bcrypt import Bcrypt
from sqlalchemy.orm import validates
import re

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)
bcrypt = Bcrypt()

# Define User model
class User(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    reviews = db.relationship('Review', back_populates="user", cascade='all, delete-orphan')
    books = db.relationship('Book', secondary='user_books', back_populates='users')
    recommendations = db.relationship('Recommendation', back_populates='user')
    
    serialize_rules = ('-books.users', '-reviews.user', '-recommendations.user')

    @property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters long")
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)

    def __repr__(self):
        return f'<User {self.id}. {self.name}>'

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
        }


# Define Book model
class Book(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    author = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(50))
    
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.id'), nullable=False)
    genre = db.relationship('Genre', back_populates="books")

    users = db.relationship('User', secondary='user_books', back_populates='books')
    reviews = db.relationship('Review', back_populates='book')

    serialize_rules = ('-users.books', '-genre.books', '-reviews.book')

    @validates('title', 'author')
    def validate_not_empty(self, key, value):
        if not value:
            raise ValueError(f'{key} cannot be empty')
        if len(value) > 50:
            raise ValueError(f'{key} cannot exceed 50 characters')
        return value

    @validates('image_url')
    def validate_image_url(self, key, value):
        if value and not re.match(r'^(http|https)://', value):
            raise ValueError('Image URL must be a valid URL')
        return value

    def __repr__(self):
        return f'<Book {self.id}. {self.title}, {self.author}>'

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "image_url": self.image_url,
            "genre": self.genre.to_dict(),
            "reviews": [review.to_dict() for review in self.reviews]
        }


# Define Review model
class Review(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text, nullable=False)
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates="reviews")

    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    book = db.relationship('Book', back_populates="reviews")

    serialize_rules = ('-user.reviews', '-book.reviews', '-user.books', '-book.genre')

    @validates('body')
    def validate_body(self, key, value):
        if not value or len(value) < 10:
            raise ValueError('Review body must be at least 10 characters long')
        return value

    def __repr__(self):
        return f'<Review {self.id}, {self.body}>'

    def to_dict(self):
        return {
            "id": self.id,
            "body": self.body,
            "book": {
                "id": self.book.id,
                "title": self.book.title
            },
            "user": {
                "id": self.user.id,
                "name": self.user.name
            }
        }


# Define Genre model
class Genre(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    genre = db.Column(db.String(100), nullable=False)

    books = db.relationship('Book', back_populates='genre', lazy=True)

    serialize_rules = ('-genre.books', '-reviews.book', '-users.books')

    @validates('genre')
    def validate_genre(self, key, value):
        if not value:
            raise ValueError('Genre cannot be empty')
        if len(value) > 20:
            raise ValueError('Genre cannot exceed 20 characters')
        return value

    def __repr__(self):
        return f'<Genre {self.id}. {self.genre}>'

    def to_dict(self):
        return {
            "id": self.id,
            "genre": self.genre
        }


class Recommendation(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='recommendations')

    serialize_rules = ('-user.recommendations',)

    @validates('title', 'author')
    def validate_not_empty(self, key, value):
        if not value:
            raise ValueError(f'{key} cannot be empty')
        if len(value) > 100:
            raise ValueError(f'{key} cannot exceed 100 characters')
        return value

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "user": {
                "id": self.user.id,
                "name": self.user.name
            }
        }


user_books = db.Table('user_books',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('book_id', db.Integer, db.ForeignKey('book.id'), primary_key=True),
    db.Column('rating', db.Integer)
)
