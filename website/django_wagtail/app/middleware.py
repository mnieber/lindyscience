from __future__ import absolute_import, division, print_function

try:
    from threading import local
except ImportError:
    from django.utils._threading_local import local

_thread_locals = local()


def get_current_request():
    """Returns the request object for this thread"""
    return getattr(_thread_locals, "request", None)


def get_current_user():
    """Returns the current user, if exist, otherwise returns None"""
    request = get_current_request()
    if request:
        return getattr(request, "user", None)


class ThreadLocalMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        _thread_locals.request = request
        response = self.get_response(request)
        del _thread_locals.request
        return response
