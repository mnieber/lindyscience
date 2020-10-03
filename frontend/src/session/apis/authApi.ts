import { doQuery, setToken } from 'src/app/client';
import { post } from 'src/utils/api_utils';
import * as R from 'rambda';

function _hasError(e, fieldName, errorMsg) {
  const errors = e.responseJSON[fieldName] || [];
  return errors.includes(errorMsg);
}

const hasErrorCode = (path, code) =>
  R.pipe(
    R.pathOr([], path),
    R.filter((x) => x.code == code),
    R.complement(R.isEmpty)
  );

const isError = (path) => R.pipe(R.pathOr([], path), R.complement(R.isEmpty));

// Api app

export async function apiSignIn(
  userId: string,
  password: string,
  rememberMe: boolean
) {
  const response = await doQuery(
    `mutation ($userId: String!, $password: String!) {
      tokenAuth(
        email: $userId,
        password: $password
      ) {
        success,
        errors,
        token,
        refreshToken,
        user {
          id,
          username,
        }
      }
    }`,
    {
      userId,
      password,
    }
  );

  if (
    hasErrorCode(
      'tokenAuth.errors.nonFieldErrors',
      'invalid_credentials'
    )(response)
  )
    return {
      success: false,
      errors: ['login/invalid_credentials'],
    };

  if (isError('tokenAuth.errors')(response))
    return {
      success: false,
      errors: ['login/failed'],
    };

  const token = response.tokenAuth.token;
  setToken(response.token);

  return {
    success: true,
    token,
    userId: response.tokenAuth.user.username,
  };
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

export async function apiLoadUserId() {
  const response = await doQuery(
    `query {
        me {
          username,
          verified
        }
      }`
  );
  return {
    userId: response.me?.username,
  };
}

export async function apiResetPassword(email: string) {
  const response = await doQuery(
    `mutation ($email: String!) {
      sendPasswordResetEmail(
        email: $email,
      ) {
        success,
        errors,
      }
    }`,
    {
      email,
    }
  );

  if (
    hasErrorCode(
      'sendPasswordResetEmail.errors.email',
      'not_verified'
    )(response)
  )
    return {
      success: false,
      errors: ['passwordReset/not_activated'],
    };

  if (isError('sendPasswordResetEmail.errors')(response))
    return {
      success: false,
      errors: ['passwordReset/failed'],
    };

  return {
    success: true,
  };
}

export async function apiChangePassword(newPassword: string, token: string) {
  const response = await doQuery(
    `mutation ($newPassword: String!, $token: String!) {
      passwordReset(
        token: $token,
        newPassword1: $newPassword,
        newPassword2: $newPassword,
      ) {
        success,
        errors,
      }
    }`,
    {
      newPassword,
      token,
    }
  );

  if (
    hasErrorCode(
      'passwordReset.errors.newPassword2',
      'password_too_short'
    )(response)
  )
    return {
      success: false,
      errors: ['changePassword/password_too_short'],
    };

  if (
    hasErrorCode(
      'passwordReset.errors.newPassword2',
      'password_too_common'
    )(response)
  )
    return {
      success: false,
      errors: ['changePassword/password_too_common'],
    };

  if (
    hasErrorCode(
      'passwordReset.errors.newPassword2',
      'password_too_similar'
    )(response)
  )
    return {
      success: false,
      errors: ['signUp/password_too_similar'],
    };

  if (isError('passwordReset.errors')(response))
    return {
      success: false,
      errors: ['changePassword/failed'],
    };

  return {
    success: true,
  };
}

export async function apiActivateAccount(token: string) {
  const response = await doQuery(
    `mutation ($token: String!) {
      verifyAccount(
        token: $token,
      ) {
        success,
        errors,
      }
    }`,
    {
      token,
    }
  );

  if (
    hasErrorCode(
      'verifyAccount.errors.nonFieldErrors',
      'already_verified'
    )(response)
  )
    return {
      success: false,
      errors: ['activateAccount/already_activated'],
    };

  if (isError('verifyAccount.errors')(response))
    return {
      success: false,
      errors: ['activateAccount/failed'],
    };

  return {
    success: true,
  };
}

export async function apiSignUp(
  email: string,
  username: string,
  password: string
) {
  const response = await doQuery(
    `mutation ($email: String!, $password: String!) {
      register(
        email: $email,
        password1: $password,
        password2: $password,
      ) {
        success,
        errors,
      }
    }`,
    {
      email,
      password,
    }
  );

  if (hasErrorCode('signUp.errors.password2', 'password_too_short')(response))
    return {
      success: false,
      errors: ['signUp/password_too_short'],
    };

  if (hasErrorCode('signUp.errors.password2', 'password_too_common')(response))
    return {
      success: false,
      errors: ['signUp/password_too_common'],
    };

  if (hasErrorCode('signUp.errors.password2', 'password_too_similar')(response))
    return {
      success: false,
      errors: ['signUp/password_too_similar'],
    };

  if (hasErrorCode('signUp.errors.email', 'unique')(response))
    return {
      success: false,
      errors: ['signUp/email_is_taken'],
    };

  if (isError('signUp.errors')(response))
    return {
      success: false,
      errors: ['signUp/failed'],
    };

  return {
    success: true,
  };
}
