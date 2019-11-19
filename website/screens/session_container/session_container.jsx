// @flow

import { Display, initDisplay } from "screens/session_container/facets/display";
import { runInAction } from "utils/mobx_wrapper";
import {
  Navigation,
  initNavigation,
} from "screens/session_container/facets/navigation";
import {
  Profiling,
  initProfiling,
} from "screens/session_container/facets/profiling";
import type { UserProfileT } from "profiles/types";
import { Inputs, initInputs } from "screens/session_container/facets/inputs";
import { facet, facetClass, registerFacets, installPolicies } from "facet";
import { Policies } from "screens/session_container/policies";

type SessionContainerPropsT = {
  dispatch: Function,
  history: any,
};

// $FlowFixMe
@facetClass
export class SessionContainer {
  @facet(Inputs) inputs: Inputs;
  @facet(Navigation) navigation: Navigation;
  @facet(Display) display: Display;
  @facet(Profiling) profiling: Profiling;

  _createFacets(props: SessionContainerPropsT) {
    this.inputs = initInputs(new Inputs(), props.dispatch);
    this.navigation = initNavigation(new Navigation(), props.history);
    this.display = initDisplay(new Display());
    this.profiling = initProfiling(new Profiling());

    registerFacets(this);
  }

  _applyPolicies(props: SessionContainerPropsT) {
    const policies = [
      Policies.navigation.handleNavigateToMoveList,

      Policies.profiling.handleLoadUserProfileForSignedInEmail,
      Policies.profiling.handleLoadEmail,
      Policies.profiling.handleSignIn,
      Policies.profiling.handleSignOut,

      Policies.url.handleLoadSelectedMoveListFromUrl,
    ];

    installPolicies(policies, this);
  }

  constructor(props: SessionContainerPropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
  }

  setInputs(userProfile: ?UserProfileT) {
    runInAction("sessionContainer.setInputs", () => {
      this.inputs.userProfile = userProfile;
    });
  }
}
