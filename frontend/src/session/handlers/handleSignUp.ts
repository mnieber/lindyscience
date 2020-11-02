import * as authApi from 'src/session/apis/authApi';

export const handleSignUp = async (
  email: string,
  username: string,
  password: string
) => {
  return await authApi.signUp(email, username, password);
};
