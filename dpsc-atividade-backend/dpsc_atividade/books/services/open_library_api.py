import requests
from typing import Optional, Dict, List
from datetime import datetime
from abc import ABC, abstractmethod


class BookAPIInterface(ABC):
    @abstractmethod
    def search_book(self, title: str, author: Optional[str] = None) -> Dict:
        pass


class OpenLibraryAPI(BookAPIInterface):
    def __init__(self):
        self.base_url = "https://openlibrary.org/search.json"
        self.cover_base_url = "https://covers.openlibrary.org/b/id/"

    def _validate_year(self, year: Optional[int]) -> int:
        try:
            current_year = datetime.now().year
            if not year or year > current_year:
                return current_year
            elif year < 1000:
                return 1000
            return year
        except (ValueError, TypeError):
            return 1000

    def _get_cover_url(self, cover_id: Optional[int]) -> str:
        if cover_id:
            return f"{self.cover_base_url}{cover_id}-L.jpg"
        return ""

    def _get_first_sentence(self, sentences: Optional[List[str]]) -> str:
        if not sentences:
            return ''
        for sentence in sentences:
            try:
                sentence.encode('ascii')
                return sentence
            except UnicodeEncodeError:
                continue
        return ''

    def search_book(self, title: str, author: Optional[str] = None) -> Dict:
        try:
            query = f"title:{title}"
            if author:
                query += f" author:{author}"

            response = requests.get(
                self.base_url,
                params={
                    'q': query,
                    'limit': 5
                },
                timeout=5
            )
            response.raise_for_status()
            data = response.json()

            suggestions = []
            if data.get('numFound', 0) > 0:
                for book in data['docs']:
                    genres = book.get('subject', [])[:3]
                    genre_str = ', '.join(genres) if genres else 'Desconhecido'
                    summary = self._get_first_sentence(
                        book.get('first_sentence', []))
                    suggestions.append({
                        'title': book.get('title', ''),
                        'author': ', '.join(book.get('author_name', [])) or 'Desconhecido',
                        'published_year': self._validate_year(book.get('first_publish_year')),
                        'genre': genre_str,
                        'summary': summary,
                        'cover_image': self._get_cover_url(book.get('cover_i')),
                        'ratings_average': book.get('ratings_average', 0.0),
                    })

            return {
                'found': data.get('numFound', 0),
                'suggestions': suggestions,
            }

        except requests.RequestException as e:
            print(f"Erro na requisição: {e}")
        except Exception as e:
            print(f"Erro desconhecido: {e}")

        return {'found': 0, 'suggestions': []}
