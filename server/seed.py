from app import app, db
from models import User, Book, Review, Genre

def seed_database():
    with app.app_context():
        # Drop all tables and create them anew
        db.drop_all()
        db.create_all()

        # Create genres
        genre1 = Genre(genre='Fiction')
        genre2 = Genre(genre='Non-fiction')

        db.session.add_all([genre1, genre2])
        db.session.commit()

        # Create books
        book1 = Book(title='The Great Gatsby', author='F. Scott Fitzgerald', image_url='https://via.placeholder.com/150', genre=genre1)
        book2 = Book(title='Sapiens', author='Yuval Noah Harari', image_url='https://via.placeholder.com/150', genre=genre2)
        book3 = Book(title='1984', author='George Orwell', image_url='https://via.placeholder.com/150', genre=genre1)

        db.session.add_all([book1, book2, book3])
        db.session.commit()

        # Create users
        user1 = User(name='Alice', password='password1')
        user2 = User(name='Bob', password='password2')

        db.session.add_all([user1, user2])
        db.session.commit()

        # Create reviews
        review1 = Review(body='Amazing book!', user=user1)
        review2 = Review(body='A must-read.', user=user2)

        db.session.add_all([review1, review2])
        db.session.commit()

        # Add books to users
        user1.books.append(book1)
        user1.books.append(book2)
        user2.books.append(book2)
        user2.books.append(book3)

        db.session.commit()

        print("Database seeded!")

if __name__ == '__main__':
    seed_database()