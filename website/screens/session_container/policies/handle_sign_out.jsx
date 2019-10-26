// @flow

import { apiSignOut } from "app/api";
import { createErrorHandler } from "app/utils";
import { listen } from "facets/index";
import { actSetSignedInEmail } from "app/actions";

export const handleSignOut = (ctr: any) => {
  listen(ctr.data, "signOut", async () => {
    apiSignOut().catch(createErrorHandler("Could not sign out"));
    ctr.data.dispatch(actSetSignedInEmail(""));
    ctr.data.history.push("/app/sign-in/");
  });
};
