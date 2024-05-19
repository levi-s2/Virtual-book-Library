from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import Bcrypt

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)
bcrypt = Bcrypt()

# Define User model
class User(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    reviews = db.relationship(
        'Review', back_populates="user", cascade='all, delete-orphan')
    books = db.relationship('Book', secondary='user_books', back_populates='users')

    serialize_rules = ('-books.users', '-reviews.user')

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'<User {self.id}. {self.name}>'

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            # Password should generally not be serialized for security reasons
        }


# Define Book model
class Book(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    image_url = db.Column(db.String(255))
    
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.id'), nullable=False)
    genre = db.relationship('Genre', back_populates="books")

    users = db.relationship('User', secondary='user_books', back_populates='books')
    reviews = db.relationship('Review', back_populates='book')

    serialize_rules = ('-users.books', '-genre.books', '-reviews.book')

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

    serialize_rules = ('-user.reviews', '-book.reviews')

    def __repr__(self):
        return f'<Review {self.id}, {self.body}>'

    def to_dict(self):
        return {
            "id": self.id,
            "body": self.body,
            "user": self.user.to_dict()
        }


# Define Genre model
class Genre(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    genre = db.Column(db.String(100), nullable=False)

    books = db.relationship('Book', back_populates='genre', lazy=True)

    serialize_rules = ('-books.genre',)

    def __repr__(self):
        return f'<Genre {self.id}. {self.genre}>'

    def to_dict(self):
        return {
            "id": self.id,
            "genre": self.genre
        }


user_books = db.Table('user_books',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('book_id', db.Integer, db.ForeignKey('book.id'), primary_key=True)
)