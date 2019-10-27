// @flow

import {
  handleBrowseToMove,
  handleBrowseToMoveList,
} from "screens/session_container/policies/browse_to_highlighted_item";
import { selectTheMoveThatMatchesTheUrl } from "screens/session_container/policies/select_the_move_that_matches_the_url";
import { selectTheMoveListThatMatchesTheUrl } from "screens/session_container/policies/select_the_movelist_that_matches_the_url";
import { handleSignOut } from "screens/session_container/policies/handle_sign_out";
import { handleLoadSelectedMoveListFromUrl } from "screens/session_container/policies/handle_load_selected_move_list_from_url";
import { handleLoadEmail } from "screens/session_container/policies/handle_load_email";
import { handleLoadUserProfileForSignedInEmail } from "screens/session_container/policies/handle_load_user_profile_for_signed_in_email";

export const Policies = {
  profiling: {
    handleLoadEmail,
    handleLoadUserProfileForSignedInEmail: handleLoadUserProfileForSignedInEmail,
    handleSignOut,
  },
  url: {
    handleLoadSelectedMoveListFromUrl,
  },
  session: {},
  navigation: {
    handleBrowseToMove,
    handleBrowseToMoveList,
    selectTheMoveListThatMatchesTheUrl,
    selectTheMoveThatMatchesTheUrl,
  },
};
