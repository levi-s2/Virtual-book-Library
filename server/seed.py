from models import db, User, Book, Review, Genre, Recommendation
from app import app

def seed_database():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Create Genres
        genre1 = Genre(genre="Fiction")
        genre2 = Genre(genre="Non-Fiction")
        genre3 = Genre(genre="Fantasy")
        genre4 = Genre(genre="Science Fiction")
        genre5 = Genre(genre="Mystery")
        genre6 = Genre(genre="Romance")
        genre7 = Genre(genre="Thriller")

        db.session.add_all([genre1, genre2, genre3, genre4, genre5, genre6, genre7])
        db.session.commit()

        # Create Books
        books = [
            Book(title="The Great Gatsby", author="F. Scott Fitzgerald", image_url="https://via.placeholder.com/150", genre=genre1),
            Book(title="1984", author="George Orwell", image_url="https://via.placeholder.com/150", genre=genre4),
            Book(title="To Kill a Mockingbird", author="Harper Lee", image_url="https://via.placeholder.com/150", genre=genre1),
            Book(title="The Catcher in the Rye", author="J.D. Salinger", image_url="https://via.placeholder.com/150", genre=genre1),
            Book(title="The Hobbit", author="J.R.R. Tolkien", image_url="https://via.placeholder.com/150", genre=genre3),
            Book(title="Fahrenheit 451", author="Ray Bradbury", image_url="https://via.placeholder.com/150", genre=genre4),
            Book(title="Pride and Prejudice", author="Jane Austen", image_url="https://via.placeholder.com/150", genre=genre6),
            Book(title="Moby-Dick", author="Herman Melville", image_url="https://via.placeholder.com/150", genre=genre1),
            Book(title="War and Peace", author="Leo Tolstoy", image_url="https://via.placeholder.com/150", genre=genre1),
            Book(title="The Odyssey", author="Homer", image_url="https://via.placeholder.com/150", genre=genre3),
            Book(title="Crime and Punishment", author="Fyodor Dostoevsky", image_url="https://via.placeholder.com/150", genre=genre5),
            Book(title="Brave New World", author="Aldous Huxley", image_url="https://via.placeholder.com/150", genre=genre4),
            Book(title="The Lord of the Rings", author="J.R.R. Tolkien", image_url="https://via.placeholder.com/150", genre=genre3),
            Book(title="Jane Eyre", author="Charlotte Brontë", image_url="https://via.placeholder.com/150", genre=genre6),
            Book(title="The Adventures of Sherlock Holmes", author="Arthur Conan Doyle", image_url="https://via.placeholder.com/150", genre=genre5)
        ]

        db.session.add_all(books)
        db.session.commit()

        # Create Users
        users = [
            User(name="user1", password_hash="Password1!"),
            User(name="user2", password_hash="Password2!"),
            User(name="user3", password_hash="Password3!"),
            User(name="user4", password_hash="Password4!"),
            User(name="user5", password_hash="Password5!")
        ]

        db.session.add_all(users)
        db.session.commit()

        # Create Reviews
        reviews = [
            Review(body="Great book! Really enjoyed it.", user_id=1, book_id=1),
            Review(body="Loved it! A masterpiece.", user_id=1, book_id=2),
            Review(body="A must-read for everyone.", user_id=2, book_id=3),
            Review(body="Highly recommend this book.", user_id=2, book_id=4),
            Review(body="An absolute classic tale.", user_id=3, book_id=5),
            Review(body="Very insightful and thought-provoking.", user_id=3, book_id=6),
            Review(body="Beautifully written novel.", user_id=4, book_id=7),
            Review(body="Couldn't put it down!", user_id=4, book_id=8),
            Review(body="A bit slow, but worth it.", user_id=5, book_id=9),
            Review(body="Fantastic story! Well done.", user_id=5, book_id=10)
        ]

        db.session.add_all(reviews)
        db.session.commit()

        # Create Recommendations
        recommendations = [
            Recommendation(title="The Alchemist", author="Paulo Coelho", user_id=1),
            Recommendation(title="Sapiens", author="Yuval Noah Harari", user_id=2),
            Recommendation(title="Educated", author="Tara Westover", user_id=3),
            Recommendation(title="Becoming", author="Michelle Obama", user_id=4),
            Recommendation(title="Where the Crawdads Sing", author="Delia Owens", user_id=5)
        ]

        db.session.add_all(recommendations)
        db.session.commit()

if __name__ == '__main__':
    seed_database()
