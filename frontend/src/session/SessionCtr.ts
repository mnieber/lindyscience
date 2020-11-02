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
import {
  lbl,
  facet,
  installPolicies,
  installActions,
  registerFacets,
} from 'facet';

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

  _installActions(props: PropsT) {
    installActions(this.authentication, {
      loadUserId: [
        //
        lbl('loadUserId', SessionCtrHandlers.handleLoadUserId),
      ],
      signIn: [
        //
        lbl('signIn', SessionCtrHandlers.handleSignIn),
        lbl('goNext', SessionCtrHandlers.handleGoNext),
      ],
      signOut: [
        //
        lbl('signOut', SessionCtrHandlers.handleSignOut),
        lbl('goNext', SessionCtrHandlers.handleGoToSignIn),
      ],
      signUp: [
        //
        lbl('signUp', SessionCtrHandlers.handleSignUp),
      ],
      resetPassword: [
        //
        lbl('resetPassword', SessionCtrHandlers.handleResetPassword),
      ],
      changePassword: [
        //
        lbl('changePassword', SessionCtrHandlers.handleChangePassword),
      ],
      activateAccount: [
        //
        lbl('activateAccount', SessionCtrHandlers.handleActivateAccount),
        lbl('goNext', SessionCtrHandlers.handleGoHome),
      ],
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
    this.inputs = initInputs(new Inputs());
    this.navigation = initNavigation(new Navigation(), {
      history: props.history,
      navigateToMoveList: SessionCtrHandlers.handleNavigateToMoveList(this),
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
