from rest_framework import status, generics, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User, Group

from .serializers import RegisterSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        if email:
            user = User.objects.get(email=email)
            username = user.username
        else:
            username = request.data.get('username')
    except User.DoesNotExist:
        return Response({
            'success': False,
            'error': {
                'message': 'Usuário não encontrado',
                'code': status.HTTP_404_NOT_FOUND
            }
        }, status=status.HTTP_404_NOT_FOUND)

    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        roles = list(user.groups.values_list('name', flat=True))
        return Response({
            'success': True,
            'data': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'roles': roles
            }
        })
    raise serializers.ValidationError({
        'success': False,
        'error': {
            'message': 'Credenciais inválidas',
            'code': status.HTTP_400_BAD_REQUEST
        }
    })


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user.is_superuser = True
        user.is_staff = True
        user.save()
        admin_group, created = Group.objects.get_or_create(name='admin')
        user.groups.add(admin_group)
        return Response({
            'success': True,
            'data': {
                'username': user.username,
                'email': user.email,
            }
        }, status=status.HTTP_201_CREATED)
