from flask import Flask
from models import db, bcrypt, User, Book, Review, Genre, user_books

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
bcrypt.init_app(app)

def seed_database():
    with app.app_context():
        # Drop all tables and recreate them
        db.drop_all()
        db.create_all()

        # Create Genres
        genre1 = Genre(genre="Fiction")
        genre2 = Genre(genre="Non-Fiction")

        db.session.add_all([genre1, genre2])
        db.session.commit()

        # Create Books
        book1 = Book(title="The Great Gatsby", author="F. Scott Fitzgerald", genre=genre1, image_url="url1")
        book2 = Book(title="Sapiens", author="Yuval Noah Harari", genre=genre2, image_url="url2")

        db.session.add_all([book1, book2])
        db.session.commit()

        # Create Users
        user1 = User(name="John Doe")
        user1.password_hash = "password123"
        user2 = User(name="Jane Smith")
        user2.password_hash = "password456"

        db.session.add_all([user1, user2])
        db.session.commit()

        # Create UserBooks association
        user1.books.append(book1)
        user2.books.append(book2)

        db.session.commit()

        # Create Reviews
        review1 = Review(body="Amazing book!", user=user1, book=book1)
        review2 = Review(body="Very insightful.", user=user2, book=book2)

        db.session.add_all([review1, review2])
        db.session.commit()

if __name__ == '__main__':
    seed_database()