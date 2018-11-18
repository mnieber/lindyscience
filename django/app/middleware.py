from django.contrib.auth.middleware import get_user
from django.contrib.auth.models import AnonymousUser
from django.utils.functional import SimpleLazyObject
from rest_framework.authentication import TokenAuthentication


class TokenAuthenticationMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.user = SimpleLazyObject(
            lambda: self.__class__.get_token_user(request))
        return self.get_response(request)

    @staticmethod
    def get_token_user(request):
        user = get_user(request)
        if user.is_authenticated:
            return user
        token_authentication = TokenAuthentication()
        credentials = token_authentication.authenticate(request)
        user = credentials[0] if credentials else AnonymousUser()
        return user
