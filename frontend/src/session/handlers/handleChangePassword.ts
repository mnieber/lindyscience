import { AuthApiT } from 'src/session/SessionCtr';
import { Authentication } from 'src/session/facets/Authentication';
import { sendMsg } from 'facet';

export const handleChangePassword = (ctr: any, authApi: AuthApiT) => {
  return async (newPassword: string, token: string) => {
    const authentication = Authentication.get(ctr);
    const response = await authApi.changePassword(newPassword, token);

    if (response.errors) {
      sendMsg(authentication, 'ChangePassword.Failed', {
        errors: response.errors,
      });
    } else {
      sendMsg(authentication, 'ChangePassword.Success');
    }
  };
};
