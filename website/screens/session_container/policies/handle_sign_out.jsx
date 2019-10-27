// @flow

import { Profiling } from "screens/session_container/facets/profiling";
import { SessionData } from "screens/session_container/facets/session_data";
import { Navigation } from "screens/session_container/facets/navigation";
import { apiSignOut } from "app/api";
import { createErrorHandler } from "app/utils";
import { listen } from "facets/index";
import { actSetSignedInEmail } from "app/actions";

export const handleSignOut = (ctr: any) => {
  const profiling = Profiling.get(ctr);
  const data = SessionData.get(ctr);
  const navigation = Navigation.get(ctr);

  listen(profiling, "signOut", async () => {
    apiSignOut().catch(createErrorHandler("Could not sign out"));
    data.dispatch(actSetSignedInEmail(""));
    navigation.history.push("/app/sign-in/");
  });
};
