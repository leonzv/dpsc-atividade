from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser(
                'admin',
                'admin@admin.com',
                'admin123'
            )
            self.stdout.write(self.style.SUCCESS(
                'Usuário admin criado :D'))
        else:
            self.stdout.write(self.style.WARNING('Usuário admin já existe :c'))
