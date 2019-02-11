"""Utility functions for testing."""

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


def create_logged_in_user(client):
    """Create user and log them in."""
    user = create_user(client)
    client.post('/api/login/', {
        'email': test_email,
        'password': test_password,
    })
    assert user.is_active
    assert user.is_authenticated
    return user
