// @flow

import {
  Profiling,
  initProfiling,
} from "screens/session_container/facets/profiling";
import {
  Navigation,
  initNavigation,
} from "screens/session_container/facets/navigation";
import { Loading, initLoading } from "screens/session_container/facets/loading";
import type { UserProfileT } from "profiles/types";
import {
  SessionData,
  initSessionData,
} from "screens/session_container/facets/session_data";
import { behaviour } from "facets/index";
import { runInAction } from "utils/mobx_wrapper";
import { Policies } from "screens/session_container/policies";

type SessionContainerPropsT = {
  dispatch: Function,
  history: any,
};

export class SessionContainer {
  @behaviour(SessionData) data: SessionData;
  @behaviour(Loading) loading: Loading;
  @behaviour(Navigation) navigation: Navigation;
  @behaviour(Profiling) profiling: Profiling;

  _createFacets(props: SessionContainerPropsT) {
    this.data = initSessionData(new SessionData(), props.dispatch);
    this.loading = initLoading(new Loading());
    this.navigation = initNavigation(new Navigation(), props.history);
    this.profiling = initProfiling(new Profiling());
  }

  _applyPolicies(props: SessionContainerPropsT) {
    [
      Policies.profiling.handleLoadEmail,
      Policies.profiling.handleLoadUserProfileForSignedInEmail,
      Policies.url.handleLoadSelectedMoveListFromUrl,
      Policies.session.handleSignOut,
    ].forEach(policy => policy(this));
  }

  constructor(props: SessionContainerPropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
  }

  setInputs(
    userProfile: ?UserProfileT,
    selectedMoveListUrl: string,
    requestedMoveListUrl: string
  ) {
    runInAction(() => {
      this.profiling.userProfile = userProfile;
      this.navigation.requestedMoveListUrl = requestedMoveListUrl;
      this.navigation.selectedMoveListUrl = selectedMoveListUrl;
    });
  }
}
