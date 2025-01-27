from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from .services.book_service import BookService
from rest_framework import serializers
from rest_framework.filters import SearchFilter


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    book_service = BookService()
    filter_backends = [SearchFilter]
    search_fields = ['title', 'author', 'genre']

    def get_permissions(self):
        """
        a API permite acesso público para listagem e detalhes de livros,
        """
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        search = self.request.query_params.get('search', '')
        return self.book_service.get_all_books(search=search)

    def create(self, request, *args, **kwargs):
        data = request.data
        if not isinstance(data, dict):
            return Response({
                'success': False,
                'error': {
                    'message': 'Invalid data. Expected a dictionary.',
                    'code': status.HTTP_400_BAD_REQUEST
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        book = self.book_service.create_book(serializer.validated_data)
        return Response(
            {
                'success': True,
                'data': self.get_serializer(book).data
            },
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        book = self.get_object()
        serializer = self.get_serializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_book = self.book_service.update_book(
            book, serializer.validated_data)
        return Response({
            'success': True,
            'data': self.get_serializer(updated_book).data
        })

    def destroy(self, request, *args, **kwargs):
        book = self.get_object()
        self.book_service.delete_book(book)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'])
    def search_suggestions(self, request):
        """
        Alguns livros tem nomes parecidos, então disponibiliza sugestões
        """
        title = request.data.get('title', '')
        author = request.data.get('author', '')

        suggestions = self.book_service.external_api.search_book(
            title=title,
            author=author
        )

        return Response({
            'success': True,
            'data': {
                'suggestions': suggestions['suggestions']
            }
        })
