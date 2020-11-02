import * as authApi from 'src/session/apis/authApi';

export const handleChangePassword = (newPassword: string, token: string) => {
  return authApi.changePassword(newPassword, token);
};
