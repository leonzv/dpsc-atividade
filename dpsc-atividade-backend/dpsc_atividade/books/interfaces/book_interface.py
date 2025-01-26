from abc import ABC, abstractmethod
from typing import List, Optional
from books.models import Book


class BookRepositoryInterface(ABC):
    @abstractmethod
    def get_all(self) -> List[Book]:
        pass

    @abstractmethod
    def get_by_id(self, book_id: int) -> Optional[Book]:
        pass

    @abstractmethod
    def create(self, data: dict) -> Book:
        pass

    @abstractmethod
    def update(self, book: Book, data: dict) -> Book:
        pass

    @abstractmethod
    def delete(self, book: Book) -> bool:
        pass
