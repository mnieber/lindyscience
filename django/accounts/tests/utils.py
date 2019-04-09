"""Utility functions for testing."""

from rest_framework import status

test_email = 'test@lindyscience.co'
test_password = '12345678'


def create_user(client):
    """Create and return user"""
    from accounts.models import User
    client.post('/auth/users/create/', {
        'email': test_email,
        'password': test_password,
        'accepts_terms': 'true'
    })
    user = User.objects.get(email=test_email)
    user.is_active = True
    user.save()

    return user


def log_in_user(client, email=test_email, password=test_password):
    res = client.post('/auth/token/login/', {
        'email': email,
        'password': password
    })
    if res.status_code != status.HTTP_200_OK:
        return False

    auth_token = res.json()['auth_token']
    client.credentials(HTTP_AUTHORIZATION='Token ' + auth_token)
    return auth_token


def log_out_user(client):
    res = client.post('/auth/token/logout/', {})
    client.credentials()
    return res.status_code == status.HTTP_204_NO_CONTENT
