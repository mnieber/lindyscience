import re
from django.core import mail
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.tests.utils import test_email, test_password, create_logged_in_user
from django.conf import settings


class AccountTest(APITestCase):
    server_name = 'testserver'
    server_url = 'https://' + settings.DOMAIN + '/'
    url_regex = 'https://(?:[a-zA-Z0-9\-\.\/])+'

    def test_create_user_account_basic(self):
        """
        Ensure we can create a new user account, activate it and log in/out as that user
        """
        # Register user using the API
        response = self.client.post(
            '/auth/users/create/', {
                'email': test_email,
                'password': test_password,
                'accepts_terms': 'true'
            })

        # Ensure registration went through
        assert response.status_code == status.HTTP_201_CREATED

        # Check in-memory dummy email outbox queue for the activation email
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Welcome to Lindy Science!')

        # Extract activation url from email body
        self.assertEqual(len(mail.outbox[0].alternatives), 1)
        html_content = mail.outbox[0].alternatives[0][0]
        urls = set([
            url for url in re.findall(self.url_regex, html_content)
            if url.startswith(self.server_url + 'activate/')
        ])
        assert len(urls) == 1
        activate_url = list(urls)[0][len(self.server_url):]

        # In a real scenario, the activate_url will open the frontend app, which will
        # make a POST request to activate the user. In the test, we simulate this by
        # directly making the POST request.
        _, uid, token = activate_url.split('/')
        response = self.client.post('/auth/users/confirm/', {
            'uid': uid,
            'token': token
        })

        # Ensure the activation went through
        assert response.status_code == status.HTTP_204_NO_CONTENT

        # Ensure the user is not automatically logged in
        response = self.client.get('/auth/users/me/', {})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

        # Log in the newly created user with wrong password
        response = self.client.post('/auth/token/login/', {
            'email': test_email,
            'password': '87654321'
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['non_field_errors'][0].lower(
        ) == 'unable to login with provided credentials.'

        # Log in the newly created user
        response = self.client.post('/auth/token/login/', {
            'email': test_email,
            'password': test_password
        })
        assert response.status_code == status.HTTP_200_OK
        auth_token = response.json()['auth_token']

        # Fetch info about the logged in user
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + auth_token)
        response = self.client.get('/auth/me/', {})
        assert response.json()['email'] == test_email

        # Log the user out
        response = self.client.post('/auth/token/logout/', {})
        assert response.status_code == status.HTTP_204_NO_CONTENT

        # Make sure the user is properly logged out
        response = self.client.get('/auth/users/me/', {})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

        # Sign up a new user with the same credentials, this should fail
        self.client.credentials()
        response = self.client.post(
            '/auth/users/create/', {
                'email': test_email,
                'password': test_password,
                'accepts_terms': 'true'
            })
        assert response.data['email'][0].lower(
        ) == 'user with this email already exists.'
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_djoser_settings(self):
        assert settings.DJOSER['EMAIL'].get(
            'activation') == 'accounts.email.ActivationEmail'
        assert settings.DJOSER['EMAIL'].get(
            'password_reset') == 'accounts.email.PasswordResetEmail'
        assert settings.DJOSER['EMAIL'].get(
            'confirmation') == 'accounts.email.ConfirmationEmail'

    def test_create_user_account_no_tos(self):
        """
        Ensure a user account can't be created without accepting TOS
        """
        response = self.client.post(
            '/auth/users/create/', {
                'email': test_email,
                'password': test_password,
                'accepts_terms': 'false'
            })

        assert response.data['accepts_terms'][0].lower(
        ) == 'required_to_accept_terms'
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_user_account_empty_field(self):
        """
        Ensure that a user with an empty email/password can't be created
        """

        # Try creating a user with an empty email
        response = self.client.post('/auth/users/create/', {
            'email': '',
            'password': test_password,
            'accepts_terms': 'true'
        })
        assert response.data['email'][0].lower(
        ) == 'this field may not be blank.'
        assert response.status_code == status.HTTP_400_BAD_REQUEST

        # Try creating a user with an empty password
        response = self.client.post('/auth/users/create/', {
            'email': test_email,
            'password': '',
            'accepts_terms': 'true'
        })
        assert response.data['password'][0].lower(
        ) == 'this field may not be blank.'
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_duplicate_nonactivated_user_account(self):
        """
        Ensure that a user tries to sign up with an already registered email
        _without having activated it the first time_, he or she will get an error
        """

        # Register user using the API
        data = {
            'email': test_email,
            'password': test_password,
            'accepts_terms': 'true'
        }
        response = self.client.post('/auth/users/create/', data)
        assert response.status_code == status.HTTP_201_CREATED

        # Try to register a user with the same credentials using the API
        response = self.client.post('/auth/users/create/', data)
        assert response.data['email'][0].lower(
        ) == 'user with this email already exists.'
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_password_reset(self):
        """
        Ensure we can create a new user account, activate it and log in/out as that user
        """
        # Register user using the API
        create_logged_in_user(self.client)

        # Clear welcome mail
        mail.outbox.clear()

        # Log the user out
        response = self.client.post('/auth/token/logout/', {})

        # Request a password recover
        response = self.client.post('/auth/password/reset/', {
            'email': test_email,
        })
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Find the recover link in the sent email
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(len(mail.outbox[0].alternatives), 1)
        html_content = mail.outbox[0].alternatives[0][0]
        urls = set([
            url for url in re.findall(self.url_regex, html_content)
            if url.startswith(self.server_url + 'login/password-reset/')
        ])
        self.assertEqual(len(urls), 1)
        password_reset_url = list(urls)[0][len(self.server_url):]

        # In a real scenario, the password_reset_url will open the frontend app, which will
        # make a POST request to reset the password. In the test, we simulate this by
        # directly making the POST request.
        _, _, uid, token = password_reset_url.split('/')

        # Request the reset
        response = self.client.post('/auth/password/reset/confirm', {
            'uid': uid,
            'token': token,
            'new_password': 'foobar',
        })
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        response = self.client.post('/auth/token/login/', {
            'email': test_email,
            'password': 'foobar'
        })
        assert response.status_code == status.HTTP_200_OK
