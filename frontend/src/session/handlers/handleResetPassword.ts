import * as authApi from 'src/session/apis/authApi';

export const handleResetPassword = async (email: string) => {
  return await authApi.resetPassword(email);
};
