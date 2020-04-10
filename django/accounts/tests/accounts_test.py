from bs4 import BeautifulSoup as Soup
import re
from django.core import mail
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.tests.utils import test_email, test_password, create_user, log_in_user, log_out_user
from django.conf import settings


class AccountTest(APITestCase):
    server_name = 'testserver'
    server_url = 'https://' + settings.DOMAIN + '/'
    url_regex = 'https://(?:[a-zA-Z0-9\-\.\/])+'

    def test_create_and_activate_user(self):
        """
        Ensure we can create a new user account, activate it and log in/out as that user
        """
        # Register user using the API
        res = self.client.post(
            '/auth/users/create/', {
                'email': test_email,
                'username': 'user1',
                'password': test_password,
                'accepts_terms': 'true'
            })

        # Ensure registration went through
        assert res.status_code == status.HTTP_201_CREATED

        # Check in-memory dummy email outbox queue for the activation email
        assert len(mail.outbox) == 1
        assert mail.outbox[0].subject == 'Welcome to Lindy Science!'

        # Extract activation url from email body
        assert len(mail.outbox[0].alternatives) == 1
        html_content = mail.outbox[0].alternatives[0][0]
        html = Soup(html_content, 'html.parser')
        urls = set([
            url for url in [a['href'] for a in html.find_all('a')]
            if url.startswith(self.server_url + 'app/register/activate')
        ])
        assert len(urls) == 1
        activate_url = list(urls)[0]

        # Check that we cannot log in yet
        get_user_model().objects.get(email=test_email)
        assert not log_in_user(self.client)

        # In a real scenario, the activate_url will open the frontend app, which will
        # make a POST request to activate the user. In the test, we simulate this by
        # directly making the POST request.
        uid, token = activate_url.split('/')[-2:]
        res = self.client.post('/auth/users/confirm/', {
            'uid': uid,
            'token': token,
        })
        assert res.status_code == status.HTTP_204_NO_CONTENT

        # Ensure the user is not automatically logged in
        res = self.client.get('/auth/users/me/', {})
        assert res.status_code == status.HTTP_401_UNAUTHORIZED

        # Create another user
        res = self.client.post(
            '/auth/users/create/', {
                'email': 'test_' + test_email,
                'username': 'user2',
                'password': 'test_' + test_password,
                'accepts_terms': 'true'
            })

        # Ensure registration went through
        assert res.status_code == status.HTTP_201_CREATED

    def test_log_in_new_user(self):
        create_user(self.client)

        # Log in the newly created user with wrong password
        res = self.client.post('/auth/token/login/', {
            'email': test_email,
            'password': '87654321'
        })
        assert res.status_code == status.HTTP_400_BAD_REQUEST
        assert res.data['non_field_errors'][0].lower(
        ) == 'unable to log in with provided credentials.'

        # Log in the newly created user
        res = self.client.post('/auth/token/login/', {
            'email': test_email,
            'password': test_password
        })
        assert res.status_code == status.HTTP_200_OK
        auth_token = res.json()['auth_token']

        # Fetch info about the logged in user
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + auth_token)
        res = self.client.get('/auth/me/', {})
        assert res.json()['email'] == test_email

        # Log the user out
        res = self.client.post('/auth/token/logout/', {})
        assert res.status_code == status.HTTP_204_NO_CONTENT

        # Make sure the user is properly logged out
        res = self.client.get('/auth/users/me/', {})
        assert res.status_code == status.HTTP_401_UNAUTHORIZED

        # Sign up a new user with the same credentials, this should fail
        self.client.credentials()
        res = self.client.post(
            '/auth/users/create/', {
                'email': test_email,
                'password': test_password,
                'accepts_terms': 'true'
            })
        assert res.data['email'][0].lower(
        ) == 'user with this email already exists.'
        assert res.status_code == status.HTTP_400_BAD_REQUEST

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
        res = self.client.post(
            '/auth/users/create/', {
                'email': test_email,
                'password': test_password,
                'accepts_terms': 'false'
            })

        assert res.data['accepts_terms'][0].lower(
        ) == 'required_to_accept_terms'
        assert res.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_with_empty_fields(self):
        """
        Ensure that a user with an empty email/password can't be created
        """
        # Try creating a user with an empty email
        res = self.client.post('/auth/users/create/', {
            'email': '',
            'password': test_password,
            'accepts_terms': 'true'
        })
        assert res.data['email'][0].lower() == 'this field may not be blank.'
        assert res.status_code == status.HTTP_400_BAD_REQUEST

        # Try creating a user with an empty password
        res = self.client.post('/auth/users/create/', {
            'email': test_email,
            'password': '',
            'accepts_terms': 'true'
        })
        assert res.data['password'][0].lower(
        ) == 'this field may not be blank.'
        assert res.status_code == status.HTTP_400_BAD_REQUEST

    def test_password_reset(self):
        """
        Ensure we can create a new user account, activate it and log in/out as that user
        """
        # Register user using the API
        create_user(self.client)
        log_in_user(self.client)

        # Clear welcome mail
        mail.outbox.clear()

        # Log the user out
        assert log_out_user(self.client)

        # Request a password recover
        res = self.client.post('/auth/password/reset/', {
            'email': test_email,
        })
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

        # Find the recover link in the sent email
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(len(mail.outbox[0].alternatives), 1)
        html_content = mail.outbox[0].alternatives[0][0]
        urls = set([
            url for url in re.findall(self.url_regex, html_content)
            if url.startswith(self.server_url + 'sign-in/reset-password/')
        ])
        self.assertEqual(len(urls), 1)
        password_reset_url = list(urls)[0][len(self.server_url):]

        # In a real scenario, the password_reset_url will open the frontend app, which will
        # make a POST request to reset the password. In the test, we simulate this by
        # directly making the POST request.
        uid, token = password_reset_url.split('/')[-2:]

        # Request the reset
        res = self.client.post('/auth/password/reset/confirm', {
            'uid': uid,
            'token': token,
            'new_password': 'foobar',
        })
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

        res = self.client.post('/auth/token/login/', {
            'email': test_email,
            'password': 'foobar'
        })
        assert res.status_code == status.HTTP_200_OK
