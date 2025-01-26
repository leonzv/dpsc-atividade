from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        if isinstance(response.data, dict):
            error_messages = {field: [str(error) for error in errors]
                              for field, errors in response.data.items()}
        else:
            error_messages = response.data
        response.data = {
            'success': False,
            'error': {
                'message': error_messages,
                'code': response.status_code
            }
        }
    else:
        response = Response({
            'success': False,
            'error': {
                'message': str(exc),
                'code': status.HTTP_500_INTERNAL_SERVER_ERROR
            }
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
