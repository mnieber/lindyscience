// @flow

import { helpUrl } from "moves/utils";
import { apiGetEmail, apiSignIn, apiSignOut } from "app/api";
import { runInAction } from "utils/mobx_wrapper";
import { Profiling } from "screens/session_container/facets/profiling";
import { Navigation } from "screens/session_container/facets/navigation";
import { handle } from "facet";
import { urlParam } from "utils/utils";

export const handleSignIn = (ctr: any) => {
  const profiling = Profiling.get(ctr);
  const navigation = Navigation.get(ctr);

  handle(profiling, "signIn", async (email: string, password: string) => {
    await apiSignIn(email, password);

    runInAction("signIn", () => {
      profiling.signedInEmail = email;
    });
    const next = urlParam("next");
    navigation.history.push(next ? next : helpUrl);
  });
};

export const handleSignOut = (ctr: any) => {
  const profiling = Profiling.get(ctr);
  const navigation = Navigation.get(ctr);

  handle(profiling, "signOut", async () => {
    await apiSignOut();
    profiling.signedInEmail = "anonymous";
    navigation.history.push("/app/sign-in/");
  });
};

export const handleLoadEmail = (ctr: any) => {
  const profiling = Profiling.get(ctr);

  handle(profiling, "loadEmail", async () => {
    try {
      const email = await apiGetEmail();
      const signedInEmail = email ? email : "anonymous";
      runInAction("handleLoadEmail", () => {
        profiling.signedInEmail = signedInEmail;
      });
    } catch {}
  });
};
