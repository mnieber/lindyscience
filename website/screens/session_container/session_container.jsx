// @flow

import type { UserProfileT } from "profiles/types";
import {
  SessionData,
  initSessionData,
} from "screens/session_container/session_data";
import { behaviour } from "facets/index";
import { runInAction } from "utils/mobx_wrapper";
import { Policies } from "screens/session_container/policies";

type SessionContainerPropsT = {
  dispatch: Function,
  history: any,
};

export class SessionContainer {
  @behaviour(SessionData) data: SessionData;

  _createFacets(props: SessionContainerPropsT) {
    this.data = initSessionData(
      new SessionData(),
      props.dispatch,
      props.history
    );
  }

  _applyPolicies(props: SessionContainerPropsT) {
    [
      Policies.userProfile.handleLoadEmail,
      Policies.userProfile.handleLoadUserProfileForSignedInEmail,
      Policies.url.handleLoadSelectedMoveListFromUrl,
      Policies.session.handleSignOut,
    ].forEach(policy => policy(this));
  }

  constructor(props: SessionContainerPropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
  }

  setInputs(userProfile: ?UserProfileT, selectedMoveListUrl: string) {
    runInAction(() => {
      this.data.userProfile = userProfile;
      this.data.selectedMoveListUrl = selectedMoveListUrl;
    });
  }
}
