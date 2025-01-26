
from django.test import TestCase
from unittest.mock import patch
from books.services.book_service import BookService


class BookServiceTests(TestCase):
    def setUp(self):
        self.book_service = BookService()

    @patch('books.services.open_library_api.requests.get')
    def test_search_book_success(self, mock_get):
        mock_response = {
            'numFound': 1,
            'docs': [{
                'title': 'Mock Book',
                'author_name': ['Mock Author'],
                'subject': ['Fiction'],
                'first_sentence': ['This is a mock sentence.'],
                'cover_i': 123456,
                'first_publish_year': 2019
            }]
        }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response

        result = self.book_service.external_api.search_book(
            title='Mock', author='Author')
        self.assertEqual(result['found'], 1)
        self.assertEqual(len(result['suggestions']), 1)
        self.assertEqual(result['suggestions'][0]['title'], 'Mock Book')

    @patch('books.services.open_library_api.requests.get')
    def test_search_book_failure(self, mock_get):
        mock_get.side_effect = Exception('API Error')
        result = self.book_service.external_api.search_book(
            title='Mock', author='Author')
        self.assertEqual(result['found'], 0)
        self.assertEqual(len(result['suggestions']), 0)
