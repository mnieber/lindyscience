// @flow

import { listen } from "facets/index";
import { apiGetEmail } from "app/api";
import { actSetSignedInEmail } from "app/actions";
import { runInAction } from "utils/mobx_wrapper";

export const handleLoadEmail = (ctr: any) => {
  listen(ctr.data, "loadEmail", async () => {
    const [email] = await Promise.all([apiGetEmail()]);
    const signedInEmail = email ? email : "anonymous";
    ctr.data.dispatch(actSetSignedInEmail(signedInEmail));
    runInAction(() => {
      ctr.data.signedInEmail = signedInEmail;
    });
  });
};
