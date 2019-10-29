// @flow

import {
  syncMoveWithCurrentUrl,
  syncUrlWithNewMove,
} from "screens/session_container/policies/select_the_move_that_matches_the_url";
import { updateMoveListsCtrInputs } from "screens/session_container/policies/update_movelists_ctr_inputs";
import { updateMovesCtrInputs } from "screens/session_container/policies/update_moves_ctr_inputs";
import {
  handleNavigateToMove,
  handleNavigateToMoveList,
} from "screens/session_container/policies/handle_navigate";
import { selectTheMoveListThatMatchesTheUrl } from "screens/session_container/policies/select_the_movelist_that_matches_the_url";
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
    handleNavigateToMove,
    handleNavigateToMoveList,
    selectTheMoveListThatMatchesTheUrl,
    syncMoveWithCurrentUrl,
    syncUrlWithNewMove,
  },
  data: {
    updateMovesCtrInputs,
    updateMoveListsCtrInputs,
  },
};
