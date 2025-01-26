from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from datetime import datetime


class Book(models.Model):
    title = models.CharField(max_length=300)
    author = models.CharField(max_length=300)
    genre = models.CharField(max_length=300)
    published_year = models.IntegerField(
        validators=[
            MinValueValidator(1000),
            MaxValueValidator(datetime.now().year)
        ]
    )
    summary = models.TextField()
    cover_image = models.ImageField(upload_to='covers/', blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['author']),
        ]

    def __str__(self):
        return self.title

    def clean(self):
        super().clean()
        if self.published_year > datetime.now().year:
            raise ValueError("Ano de publicação não pode ser no futuro")
