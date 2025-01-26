from django.contrib import admin
from django.utils.html import mark_safe
from .models import Book


class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'genre',
                    'published_year', 'cover_thumbnail')
    readonly_fields = ('cover_thumbnail',)

    def cover_thumbnail(self, obj):
        if obj.cover_image:
            return mark_safe(f'<img src="{obj.cover_image.url}" width="50" height="75" />')
        return "Sem imagem"
    cover_thumbnail.short_description = 'Capa'


admin.site.register(Book, BookAdmin)
