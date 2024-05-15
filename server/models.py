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


# Define Book model
class Book(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    image_url = db.Column(db.String(255))
    
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.id'), nullable=False)
    
    genre = db.relationship('Genre', back_populates="books")

    def __repr__(self):
        return f'<Book{self.id}. {self.title}, {self.author}>'


# Define Review model
class Review(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text, nullable=False)
    
    

# Define Genre model
class Genre(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    genre = db.Column(db.String(100), nullable=False)

    books = db.relationship('Book', back_populates='genre', lazy=True)

    def __repr__(self):
        return f'<Genre{self.id}. {self.genre}'
    