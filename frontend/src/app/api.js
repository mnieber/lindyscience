// @flow

import { toCamelCase } from 'src/utils/utils';
import { get, post } from 'src/utils/api_utils';
import { setToken } from 'src/app/client';

function _hasError(e, fieldName, errorMsg) {
  const errors = e.responseJSON[fieldName] || [];
  return errors.includes(errorMsg);
}

// Api app

export async function apiSignIn(email: string, password: string) {
  if (email == 'guest@guest.com') {
    email = 'lindyscience' + '@';
    password = 'trickeration';
    email += 'gmail' + '.com';
  }
  try {
    const response = toCamelCase(
      await post('http://localhost:8000/auth/token/login', { email, password })
    );
    if (response.authToken) {
      setToken(response.authToken);
      return '';
    }
  } catch (e) {
    throw _hasError(
      e,
      'non_field_errors',
      'Unable to log in with provided credentials.'
    )
      ? 'bad_credentials'
      : 'cannot_sign_in';
  }
}

export async function apiSignOut() {
  try {
    await post('/auth/token/logout', {});
    setToken('');
    return '';
  } catch (e) {
    throw 'Could not sign out';
  }
}

export async function apiGetEmail() {
  const response = toCamelCase(await get('/auth/users/me'));
  return response.email;
}

export async function apiResetPassword(email: string) {
  try {
    const response = toCamelCase(
      await post('/auth/password/reset/', {
        email: email,
      })
    );
    return '';
  } catch (e) {
    throw _hasError(e, 'email', 'Enter a valid email address.')
      ? 'invalid_email'
      : 'cannot_reset';
  }
}

export async function apiChangePassword(
  newPassword: string,
  uid: string,
  token: string
) {
  try {
    const response = toCamelCase(
      await post('/auth/password/reset/confirm', {
        uid,
        token,
        new_password: newPassword,
      })
    );
  } catch (e) {
    throw _hasError(e, 'non_field_errors', 'Invalid token for given user.')
      ? 'invalid_token'
      : 'cannot_sign_in';
  }
}

export async function apiActivateAccount(uid: string, token: string) {
  try {
    const response = toCamelCase(
      await post('/auth/users/confirm/', {
        uid,
        token,
      })
    );
  } catch (e) {
    throw _hasError(e, 'non_field_errors', 'Invalid token for given user.')
      ? 'invalid_token'
      : 'cannot_sign_in';
  }
}

export async function apiRegister(
  email: string,
  username: string,
  password: string
) {
  try {
    const response = toCamelCase(
      await post('/auth/users/create/', {
        email,
        username,
        password,
        accepts_terms: true,
      })
    );
  } catch (e) {
    throw 'error_registering_user';
  }
}
