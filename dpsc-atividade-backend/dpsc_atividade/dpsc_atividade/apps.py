from django.apps import AppConfig
from django.contrib.auth.models import Group, Permission

class DpscAtividadeConfig(AppConfig):
    name = 'dpsc_atividade'

    def ready(self):
        admin_group, created = Group.objects.get_or_create(name='admin')
        if created:
            permissions = Permission.objects.all()
            admin_group.permissions.set(permissions)
