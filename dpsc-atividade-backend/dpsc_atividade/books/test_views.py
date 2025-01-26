import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from books.models import Book
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
import io
import os


@pytest.mark.django_db
class TestBook:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.client = APIClient()
        self.list_url = reverse('book-list')
        self.book_data = {
            'title': 'Test Book',
            'author': 'Author Name',
            'genre': 'Fiction',
            'summary': 'A test book summary.',
            'published_year': 2020,
            'cover_image': self.generate_image_file()
        }
        self.book = Book.objects.create(**self.book_data)
        self.user = User.objects.create_user(
            username='testuser', email='test@example.com', password='strongpassword123')
        self.client.force_authenticate(user=self.user)

    def generate_image_file(self):
        file = io.BytesIO()
        image = Image.new('RGB', (100, 100), color='red')
        image.save(file, 'jpeg')
        file.name = 'test.jpg'
        file.seek(0)
        return SimpleUploadedFile(file.name, file.read(), content_type='image/jpeg')

    def teardown_method(self, method):
        for book in Book.objects.all():
            if book.cover_image:
                if os.path.isfile(book.cover_image.path):
                    os.remove(book.cover_image.path)

    def test_list_books(self):
        response = self.client.get(self.list_url, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
        assert len(response.data['results']) >= 1

    def test_create_book(self):
        new_book_data = {
            'title': 'New Test Book',
            'author': 'New Author',
            'genre': 'Non-Fiction',
            'summary': 'A new test book summary.',
            'published_year': 2021,
            'cover_image': self.generate_image_file()
        }
        response = self.client.post(
            self.list_url, new_book_data, format='multipart')
        assert response.status_code == status.HTTP_201_CREATED
        assert 'success' in response.data
        assert response.data['success']
        assert Book.objects.count() == 2

    def test_update_book(self):
        update_url = reverse('book-detail', args=[self.book.id])
        update_data = {'genre': 'Updated Genre'}
        response = self.client.put(update_url, update_data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'success' in response.data
        assert response.data['success']
        self.book.refresh_from_db()
        assert self.book.genre == 'Updated Genre'

    def test_delete_book(self):
        delete_url = reverse('book-detail', args=[self.book.id])
        response = self.client.delete(delete_url, format='json')
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Book.objects.count() == 0

    def test_search_suggestions(self):
        search_url = reverse('book-search-suggestions')
        search_data = {'title': 'Test', 'author': 'Author'}
        response = self.client.post(search_url, search_data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert 'success' in response.data
        assert response.data['success']
        assert 'suggestions' in response.data['data']
