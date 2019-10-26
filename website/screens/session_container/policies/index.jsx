// @flow

import { handleSignOut } from "screens/session_container/policies/handle_sign_out";
import { handleLoadSelectedMoveListFromUrl } from "screens/session_container/policies/handle_load_selected_move_list_from_url";
import { handleLoadEmail } from "screens/session_container/policies/handle_load_email";
import { handleLoadUserProfileForSignedInEmail } from "screens/session_container/policies/handle_load_user_profile_for_signed_in_email";

export const Policies = {
  userProfile: {
    handleLoadEmail,
    handleLoadUserProfileForSignedInEmail: handleLoadUserProfileForSignedInEmail,
  },
  url: {
    handleLoadSelectedMoveListFromUrl,
  },
  session: {
    handleSignOut,
  },
};
