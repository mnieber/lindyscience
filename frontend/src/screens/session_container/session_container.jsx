// @flow

import { facet, installPolicies, registerFacets } from 'src/facet';
import { Data, initData } from 'src/screens/session_container/facets/data';
import {
  Display,
  initDisplay,
} from 'src/screens/session_container/facets/display';
import {
  Navigation,
  initNavigation,
} from 'src/screens/session_container/facets/navigation';
import {
  Profiling,
  initProfiling,
} from 'src/screens/session_container/facets/profiling';
import {
  Inputs,
  initInputs,
} from 'src/screens/session_container/facets/inputs';
import * as SessionContainerPolicies from 'src/screens/session_container/policies';

type PropsT = {
  history: any,
};

export class SessionContainer {
  @facet inputs: Inputs;
  @facet navigation: Navigation;
  @facet display: Display;
  @facet profiling: Profiling;
  @facet data: Data;

  _createFacets(props: PropsT) {
    this.inputs = initInputs(new Inputs());
    this.navigation = initNavigation(new Navigation(), props.history);
    this.display = initDisplay(new Display());
    this.profiling = initProfiling(new Profiling());
    this.data = initData(new Data());

    registerFacets(this);
  }

  _applyPolicies(props: PropsT) {
    const policies = [
      // navigation
      SessionContainerPolicies.handleNavigateToMoveList,

      // profiling
      SessionContainerPolicies.handleLoadUserProfileForSignedInEmail,
      SessionContainerPolicies.handleLoadEmail,
      SessionContainerPolicies.handleSignIn,
      SessionContainerPolicies.handleSignOut,

      // navigation
      SessionContainerPolicies.handleLoadSelectedMoveListFromUrl,
    ];

    installPolicies(policies, this);
  }

  constructor(props: PropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
  }
}
