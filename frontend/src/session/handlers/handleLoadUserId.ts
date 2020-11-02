import * as authApi from 'src/session/apis/authApi';

export const handleLoadUserId = async () => {
  return await authApi.loadUserId();
};
