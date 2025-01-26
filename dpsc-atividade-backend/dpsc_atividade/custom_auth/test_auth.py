import pytest
from django.contrib.auth.models import User, Group
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse


@pytest.mark.django_db
class TestAuthentication:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.client = APIClient()
        self.register_url = reverse('auth_register')
        self.login_url = reverse('auth_login')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'strongpassword123',
            'password_confirm': 'strongpassword123'
        }

    def test_user_registration(self):
        response = self.client.post(
            self.register_url, self.user_data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['success']
        assert User.objects.count() == 1
        user = User.objects.get(username='testuser')
        assert user.is_staff
        assert user.is_superuser
        assert 'admin' in user.groups.values_list('name', flat=True)

    def test_user_login(self):
        User.objects.create_user(
            username='testuser', email='test@example.com', password='strongpassword123')
        login_data = {
            'email': 'test@example.com',
            'password': 'strongpassword123'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success']
        assert 'access' in response.data['data']
        assert 'refresh' in response.data['data']

    def test_login_with_invalid_credentials(self):
        login_data = {
            'email': 'nonexistent@example.com',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert not response.data['success']
