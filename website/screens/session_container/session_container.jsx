// @flow

import {
  Navigation,
  type UrlParamsT,
  initNavigation,
} from "screens/session_container/facets/navigation";
import { MovesContainer } from "screens/moves_container/moves_container";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import {
  Profiling,
  initProfiling,
} from "screens/session_container/facets/profiling";
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
  movesCtr: MovesContainer,
  moveListsCtr: MoveListsContainer,
};

export class SessionContainer {
  @behaviour(SessionData) data: SessionData;
  @behaviour(Loading) loading: Loading;
  @behaviour(Navigation) navigation: Navigation;
  @behaviour(Profiling) profiling: Profiling;

  _createFacets(props: SessionContainerPropsT) {
    this.data = initSessionData(
      new SessionData(),
      props.dispatch,
      props.movesCtr,
      props.moveListsCtr
    );
    this.loading = initLoading(new Loading());
    this.navigation = initNavigation(new Navigation(), props.history);
    this.profiling = initProfiling(new Profiling());
  }

  _applyPolicies(props: SessionContainerPropsT) {
    [
      Policies.navigation.browseToHighlightedItem,
      Policies.navigation.selectTheMoveListThatMatchesTheUrl,
      Policies.navigation.selectTheMoveThatMatchesTheUrl,
      Policies.profiling.handleLoadEmail,
      Policies.profiling.handleLoadUserProfileForSignedInEmail,
      Policies.profiling.handleSignOut,
      Policies.url.handleLoadSelectedMoveListFromUrl,
    ].forEach(policy => policy(this));
  }

  constructor(props: SessionContainerPropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
  }

  setInputs(userProfile: ?UserProfileT) {
    runInAction("sessionContainer.setInputs", () => {
      this.profiling.userProfile = userProfile;
    });
  }
}
