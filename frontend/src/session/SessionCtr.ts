import {
  Authentication,
  initAuthentication,
} from 'src/session/facets/Authentication';
import * as SessionCtrPolicies from 'src/session/policies';
import * as SessionCtrHandlers from 'src/session/handlers';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesStore } from 'src/moves/MovesStore';
import { TipsStore } from 'src/tips/TipsStore';
import { VotesStore } from 'src/votes/VotesStore';
import { Display, initDisplay } from 'src/session/facets/Display';
import { Inputs, initInputs } from 'src/session/facets/Inputs';
import { Navigation, initNavigation } from 'src/session/facets/Navigation';
import { Profiling, initProfiling } from 'src/session/facets/Profiling';
import { facet, installPolicies, registerFacets } from 'facet';
import * as authApi from 'src/session/apis/authApi';

export type AuthApiT = {
  loadUserId: Function;
  signUp: Function;
  resetPassword: (email: string) => any;
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
  @facet moveListsStore: MoveListsStore;
  @facet movesStore: MovesStore;
  @facet tipsStore: TipsStore;
  @facet votesStore: VotesStore;

  _applyPolicies(props: PropsT) {
    const policies = [
      // profiling
      SessionCtrPolicies.handleLoadUserProfileForSignedInEmail,
      // navigation
      SessionCtrPolicies.handleLoadSelectedMoveListFromUrl,
      // tips
      SessionCtrPolicies.handleVoteOnTip,
    ];

    installPolicies<SessionContainer>(policies, this);
  }

  constructor(props: PropsT) {
    this.inputs = initInputs(new Inputs());
    this.navigation = initNavigation(new Navigation(), {
      history: props.history,
      navigateToMoveList: SessionCtrHandlers.handleNavigateToMoveList(this),
    });
    this.display = initDisplay(new Display());
    this.profiling = initProfiling(new Profiling());
    this.authentication = initAuthentication(new Authentication(), {
      signIn: SessionCtrHandlers.handleSignIn(this, authApi),
      signOut: SessionCtrHandlers.handleSignOut(this, authApi),
      signUp: SessionCtrHandlers.handleSignUp(this, authApi),
      loadUserId: SessionCtrHandlers.handleLoadUserId(this, authApi),
      resetPassword: SessionCtrHandlers.handleResetPassword(this, authApi),
      changePassword: SessionCtrHandlers.handleChangePassword(this, authApi),
      activateAccount: SessionCtrHandlers.handleActivateAccount(this, authApi),
    });
    this.moveListsStore = new MoveListsStore();
    this.movesStore = new MovesStore();
    this.tipsStore = new TipsStore();
    this.votesStore = new VotesStore();

    registerFacets(this);
    this._applyPolicies(props);
  }
}
