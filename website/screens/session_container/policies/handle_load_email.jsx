// @flow

import { SessionData } from "screens/session_container/facets/session_data";
import { Profiling } from "screens/session_container/facets/profiling";
import { listen } from "facets/index";
import { apiGetEmail } from "app/api";
import { actSetSignedInEmail } from "app/actions";
import { runInAction } from "utils/mobx_wrapper";

export const handleLoadEmail = (ctr: any) => {
  const profiling = Profiling.get(ctr);
  const data = SessionData.get(ctr);

  listen(profiling, "loadEmail", async () => {
    const [email] = await Promise.all([apiGetEmail()]);
    const signedInEmail = email ? email : "anonymous";
    data.dispatch(actSetSignedInEmail(signedInEmail));
    runInAction("handleLoadEmail", () => {
      profiling.signedInEmail = signedInEmail;
    });
  });
};
