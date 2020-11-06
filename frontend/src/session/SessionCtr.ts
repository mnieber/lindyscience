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
import { Navigation, initNavigation } from 'src/session/facets/Navigation';
import { Profiling, initProfiling } from 'src/session/facets/Profiling';
import { facet, installPolicies, installActions, registerFacets } from 'facet';

type PropsT = {
  history: any;
};

export class SessionContainer {
  @facet navigation: Navigation;
  @facet display: Display;
  @facet profiling: Profiling;
  @facet authentication: Authentication;
  @facet moveListsStore: MoveListsStore;
  @facet movesStore: MovesStore;
  @facet tipsStore: TipsStore;
  @facet votesStore: VotesStore;

  _installActions(props: PropsT) {
    installActions(this.authentication, {
      loadUserId: {
        loadUserId: [SessionCtrHandlers.handleLoadUserId],
      },
      signIn: {
        signIn: [SessionCtrHandlers.handleSignIn],
        goNext: [SessionCtrHandlers.handleGoNext],
      },
      signOut: {
        signOut: [SessionCtrHandlers.handleSignOut],
        goNext: [SessionCtrHandlers.handleGoToSignIn],
      },
      signUp: {
        signUp: [SessionCtrHandlers.handleSignUp],
      },
      resetPassword: {
        resetPassword: [SessionCtrHandlers.handleResetPassword],
      },
      changePassword: {
        changePassword: [SessionCtrHandlers.handleChangePassword],
      },
      activateAccount: {
        activateAccount: [SessionCtrHandlers.handleActivateAccount],
        goNext: [SessionCtrHandlers.handleGoHome],
      },
    });

    installActions(this.navigation, {
      navigateToMoveList: {
        navigate: [SessionCtrHandlers.handleNavigateToMoveList],
      },
      navigateToMove: {
        navigate: [SessionCtrHandlers.handleNavigateToMove],
      },
    });
  }

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
    this.navigation = initNavigation(new Navigation(), {
      history: props.history,
    });
    this.display = initDisplay(new Display());
    this.profiling = initProfiling(new Profiling());
    this.authentication = initAuthentication(new Authentication());
    this.moveListsStore = new MoveListsStore();
    this.movesStore = new MovesStore();
    this.tipsStore = new TipsStore();
    this.votesStore = new VotesStore();

    registerFacets(this);
    this._installActions(props);
    this._applyPolicies(props);
  }
}
