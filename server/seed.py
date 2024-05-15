from app import app, db
from models import User, Book, Review, Genre

def seed_database():
    with app.app_context():
        # Create users
        user1 = User(name='John Doe', password='password123')
        user2 = User(name='Jane Smith', password='securepass')

        # Create genres
        genre1 = Genre(genre='Fiction')
        genre2 = Genre(genre='Non-fiction')

        # Create books
        book1 = Book(title='The Great Gatsby', author='F. Scott Fitzgerald', image_url='https://example.com/great-gatsby.jpg', genre=genre1)
        book2 = Book(title='To Kill a Mockingbird', author='Harper Lee', image_url='https://example.com/to-kill-a-mockingbird.jpg', genre=genre1)
        book3 = Book(title='Sapiens: A Brief History of Humankind', author='Yuval Noah Harari', image_url='https://example.com/sapiens.jpg', genre=genre2)

        # Create reviews
        review1 = Review(body='This book is a classic!')
        review2 = Review(body='I enjoyed reading this book.')

        # Add objects to session and commit changes
        db.session.add_all([user1, user2, genre1, genre2, book1, book2, book3, review1, review2])
        db.session.commit()

if __name__ == '__main__':
    seed_database()
    print('Database seeded successfully!')