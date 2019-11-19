// @flow

import { handleNavigateToMoveList } from "screens/session_container/policies/handle_navigate_to_movelist";
import {
  handleSignOut,
  handleSignIn,
  handleLoadEmail,
} from "screens/session_container/policies/handle_sign_out";
import { handleLoadSelectedMoveListFromUrl } from "screens/session_container/policies/handle_load_selected_move_list_from_url";
import { handleLoadUserProfileForSignedInEmail } from "screens/session_container/policies/handle_load_user_profile_for_signed_in_email";

export const Policies = {
  profiling: {
    handleLoadUserProfileForSignedInEmail: handleLoadUserProfileForSignedInEmail,
    handleSignIn,
    handleSignOut,
    handleLoadEmail,
  },
  url: {
    handleLoadSelectedMoveListFromUrl,
  },
  session: {},
  navigation: {
    handleNavigateToMoveList,
  },
  data: {},
};
