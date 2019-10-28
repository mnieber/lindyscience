// @flow

import { Profiling } from "screens/session_container/facets/profiling";
import { Inputs } from "screens/session_container/facets/inputs";
import { Navigation } from "screens/session_container/facets/navigation";
import { apiSignOut } from "app/api";
import { createErrorHandler } from "app/utils";
import { listen } from "facets/index";
import { actSetSignedInEmail } from "app/actions";

export const handleSignOut = (ctr: any) => {
  const profiling = Profiling.get(ctr);
  const inputs = Inputs.get(ctr);
  const navigation = Navigation.get(ctr);

  listen(profiling, "signOut", async () => {
    apiSignOut().catch(createErrorHandler("Could not sign out"));
    inputs.dispatch(actSetSignedInEmail(""));
    navigation.history.push("/app/sign-in/");
  });
};
