import { doQuery, setToken } from 'src/app/client';
import { post } from 'src/utils/api_utils';
import * as _ from 'lodash/fp';

const hasErrorCode = (path: any, code: any) =>
  _.flow(
    _.pathOr([], path),
    _.filter((x: any) => x.code === code),
    _.complement(_.isEmpty)
  );

const isError = (path: any) =>
  _.flow(_.pathOr([], path), _.complement(_.isEmpty));

// Api app

export async function signIn(
  userId: string,
  password: string,
  rememberMe: boolean
) {
  const query = `mutation ($userId: String!, $password: String!) {
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
    }`;

  const response: any = await doQuery(query, {
    userId,
    password,
  });

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
  setToken(token);

  return {
    success: true,
    token,
    userId: response.tokenAuth.user.username,
  };
}

export async function signOut() {
  try {
    await post('/auth/token/logout', {});
    setToken('');
    return '';
  } catch (e) {
    throw Error('Could not sign out');
  }
}

export async function loadUserId() {
  const query = `query {
        me {
          username,
          verified
        }
      }`;
  const response: any = await doQuery(query, {});
  return {
    userId: response.me?.username,
  };
}

export async function resetPassword(email: string) {
  const query = `mutation ($email: String!) {
      sendPasswordResetEmail(
        email: $email,
      ) {
        success,
        errors,
      }
    }`;
  const response: any = await doQuery(query, {
    email,
  });

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

export async function changePassword(newPassword: string, token: string) {
  const query = `mutation ($newPassword: String!, $token: String!) {
      passwordReset(
        token: $token,
        newPassword1: $newPassword,
        newPassword2: $newPassword,
      ) {
        success,
        errors,
      }
    }`;
  const response: any = await doQuery(query, {
    newPassword,
    token,
  });

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

export async function activateAccount(token: string) {
  const query = `mutation ($token: String!) {
      verifyAccount(
        token: $token,
      ) {
        success,
        errors,
      }
    }`;
  const response: any = await doQuery(query, {
    token,
  });

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

export async function signUp(
  email: string,
  username: string,
  password: string
) {
  const query = `mutation ($email: String!, $password: String!) {
      register(
        email: $email,
        password1: $password,
        password2: $password,
      ) {
        success,
        errors,
      }
    }`;
  const response: any = await doQuery(query, {
    email,
    password,
  });

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
