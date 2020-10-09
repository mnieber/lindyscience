import {
  Authentication,
  initAuthentication,
} from 'src/session/facets/Authentication';
import * as SessionCtrPolicies from 'src/session/policies';
import { Data, initData } from 'src/session/facets/Data';
import { Display, initDisplay } from 'src/session/facets/Display';
import { Inputs, initInputs } from 'src/session/facets/Inputs';
import { Navigation, initNavigation } from 'src/session/facets/Navigation';
import { Profiling, initProfiling } from 'src/session/facets/Profiling';
import { facet, installPolicies, registerFacets } from 'facet';

export type AuthApiT = {
  loadUserId: Function;
  signUp: Function;
  resetPassword: Function;
  changePassword: Function;
  signIn: Function;
  signOut: Function;
  activateAccount: Function;
};

type PropsT = {
  history: any;
};

export class SessionContainer {
  @facet inputs: Inputs;
  @facet navigation: Navigation;
  @facet display: Display;
  @facet profiling: Profiling;
  @facet authentication: Authentication;
  @facet data: Data;

  _applyPolicies(props: PropsT) {
    const policies = [
      // navigation
      SessionCtrPolicies.handleNavigateToMoveList,

      // profiling
      SessionCtrPolicies.handleLoadUserProfileForSignedInEmail,
      SessionCtrPolicies.handleLoadUserId,
      SessionCtrPolicies.handleSignIn,
      SessionCtrPolicies.handleSignOut,

      // navigation
      SessionCtrPolicies.handleLoadSelectedMoveListFromUrl,
    ];

    installPolicies(policies, this);
  }

  constructor(props: PropsT) {
    this.inputs = initInputs(new Inputs());
    this.navigation = initNavigation(new Navigation(), props.history);
    this.display = initDisplay(new Display());
    this.profiling = initProfiling(new Profiling());
    this.authentication = initAuthentication(new Authentication());
    this.data = initData(new Data());

    registerFacets(this);
    this._applyPolicies(props);
  }
}
