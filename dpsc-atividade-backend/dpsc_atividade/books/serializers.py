from rest_framework import serializers
from .models import Book
from datetime import datetime


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'genre', 'cover_image',
            'published_year', 'summary', 'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_published_year(self, value):
        if value is None:
            raise serializers.ValidationError(
                "Ano de publicação é obrigatório")
        if value > datetime.now().year:
            raise serializers.ValidationError(
                "Ano de publicação não pode ser no futuro")
        if value < 1000:
            raise serializers.ValidationError(
                "Ano de publicação não pode ser menor que 1000")
        return value

    def validate_title(self, value):
        if len(value.strip()) < 1:
            raise serializers.ValidationError("Título não pode ser vazio")
        return value

    def validate_genre(self, value):
        genres = [genre.strip() for genre in value.split(',')]
        if len(genres) > 5:
            raise serializers.ValidationError(
                "Não pode haver mais de três gêneros.")
        return ', '.join(genres)
