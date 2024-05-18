from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import MetaData

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

# Define User model
class User(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)

    reviews = db.relationship(
        'Review', back_populates="user", cascade='all, delete-orphan')
    books = db.relationship('Book', secondary='user_books', back_populates='users')

    serialize_rules = ('-books.users', '-reviews.user',)

    def __repr__(self):
        return f'<User {self.id}. {self.name}>'

# Define Book model
class Book(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    image_url = db.Column(db.String(255))

    genre_id = db.Column(db.Integer, db.ForeignKey('genre.id'), nullable=False)
    genre = db.relationship('Genre', back_populates="books")

    users = db.relationship('User', secondary='user_books', back_populates='books')

    serialize_rules = ('-users.books', '-genre.books',)

    def __repr__(self):
        return f'<Book {self.id}. {self.title}, {self.author}>'

# Define Review model
class Review(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates="reviews")

    serialize_rules = ('-user.reviews',)

    def __repr__(self):
        return f'<Review {self.id}. {self.body}>'

# Define Genre model
class Genre(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    genre = db.Column(db.String(100), nullable=False)

    books = db.relationship('Book', back_populates='genre', lazy=True)

    serialize_rules = ('-books.genre',)

    def __repr__(self):
        return f'<{self.genre}>'

user_books = db.Table('user_books',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('book_id', db.Integer, db.ForeignKey('book.id'), primary_key=True)
)