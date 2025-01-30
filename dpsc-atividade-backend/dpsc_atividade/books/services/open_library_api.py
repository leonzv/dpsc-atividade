import requests
from typing import Optional, Dict, List
from datetime import datetime
from abc import ABC, abstractmethod
import asyncio
import aiohttp


class BookAPIInterface(ABC):
    @abstractmethod
    def search_book(self, title: str, author: Optional[str] = None) -> Dict:
        pass


class OpenLibraryAPI(BookAPIInterface):
    def __init__(self):
        self.base_url = "https://openlibrary.org"
        self.search_url = f"{self.base_url}/search.json"
        self.cover_base_url = "https://covers.openlibrary.org/b/id"

    async def _fetch_ratings(self, session: aiohttp.ClientSession, work_key: str) -> Dict:
        """Busca as avaliações de um livro"""
        try:
            url = f"{self.base_url}{work_key}/ratings.json"
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    return {
                        'average': data.get('summary', {}).get('average', 0.0),
                    }
        except Exception as e:
            print(f"Erro ao buscar ratings do livro: {e}")
        return {'average': 0.0}

    async def _fetch_book_details(self, session: aiohttp.ClientSession, work_key: str) -> Dict:
        """Busca os detalhes do livro e suas avaliações"""
        try:
            details_task = self._fetch_book_details_only(session, work_key)
            ratings_task = self._fetch_ratings(session, work_key)

            details, ratings = await asyncio.gather(details_task, ratings_task)
            details['ratings'] = ratings
            return details

        except Exception as e:
            print(f"Erro ao buscar detalhes do livro: {e}")
        return {}

    async def _fetch_book_details_only(self, session: aiohttp.ClientSession, work_key: str) -> Dict:
        """Busca os detalhes 'básicos' do livro"""
        try:
            url = f"{self.base_url}{work_key}.json"
            async with session.get(url) as response:
                if response.status == 200:
                    return await response.json()
        except Exception as e:
            print(f"Erro ao buscar detalhes do livro: {e}")
        return {}

    def _get_cover_url(self, cover_id: Optional[int]) -> str:
        if cover_id:
            return f"{self.cover_base_url}/{cover_id}-L.jpg"
        return ""

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

    def _extract_description(self, details: Dict) -> str:
        description = details.get('description', '')
        if isinstance(description, dict):
            return description.get('value', '')
        return str(description) if description else ''

    async def _fetch_all_book_details(self, books: List[Dict]) -> List[Dict]:
        async with aiohttp.ClientSession() as session:
            tasks = []
            for book in books:
                if 'key' in book:
                    tasks.append(self._fetch_book_details(
                        session, book['key']))

            details = await asyncio.gather(*tasks)
            return details

    def search_book(self, title: str, author: Optional[str] = None) -> Dict:
        try:
            query = f"title:{title}"
            if author:
                query += f" author:{author}"

            response = requests.get(
                self.search_url,
                params={
                    'q': query,
                    'limit': 5
                },
                timeout=5
            )
            response.raise_for_status()
            search_data = response.json()

            if search_data.get('numFound', 0) == 0:
                return {'found': 0, 'suggestions': []}

            book_details = asyncio.run(self._fetch_all_book_details(search_data['docs'])
                                       )

            suggestions = []
            for book, details in zip(search_data['docs'], book_details):
                genres = details.get('subjects', [])[
                    :3] or book.get('subject', [])[:3]
                genre_str = ', '.join(genres) if genres else 'Desconhecido'

                description = self._extract_description(details)
                ratings = details.get('ratings', {})

                suggestions.append({
                    'title': book.get('title', ''),
                    'author': ', '.join(book.get('author_name', [])) or 'Desconhecido',
                    'published_year': self._validate_year(book.get('first_publish_year')),
                    'genre': genre_str,
                    'summary': description,
                    'cover_image': self._get_cover_url(book.get('cover_i')),
                    'ratings_average': ratings.get('average', 0.0),
                })

            return {
                'found': search_data.get('numFound', 0),
                'suggestions': suggestions,
            }

        except requests.RequestException as e:
            print(f"Erro na requisição: {e}")
        except Exception as e:
            print(f"Erro desconhecido: {e}")

        return {'found': 0, 'suggestions': []}
