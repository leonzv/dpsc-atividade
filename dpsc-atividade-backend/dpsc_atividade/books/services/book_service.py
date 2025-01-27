from typing import List, Optional
from books.models import Book
from .open_library_api import OpenLibraryAPI
from django.db.models import Q


class BookService:
    def __init__(self):
        self.external_api = OpenLibraryAPI()

    def get_all_books(self, search: str = "") -> List[Book]:
        if search:
            return Book.objects.filter(
                Q(title__icontains=search) | Q(author__icontains=search)
            )
        return Book.objects.all()

    def get_book_by_id(self, book_id: int) -> Optional[Book]:
        try:
            return Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return None

    def create_book(self, data: dict) -> Book:
        return Book.objects.create(**data)

    def update_book(self, book: Book, data: dict) -> Book:
        for key, value in data.items():
            setattr(book, key, value)
        book.save()
        return book

    def delete_book(self, book: Book) -> bool:
        book.delete()
        return True
