import {
  Authentication,
  initAuthentication,
} from 'src/session/facets/Authentication';
import * as Policies from 'src/session/policies';
import * as Handlers from 'src/session/handlers';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesStore } from 'src/moves/MovesStore';
import { TipsStore } from 'src/tips/TipsStore';
import { TagsStore } from 'src/tags/TagsStore';
import { VotesStore } from 'src/votes/VotesStore';
import { Display, initDisplay } from 'src/session/facets/Display';
import { Navigation, initNavigation } from 'src/session/facets/Navigation';
import { Profiling, initProfiling } from 'src/session/facets/Profiling';
import { facet, installPolicies, setCallbacks, registerFacets } from 'facility';

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
  @facet tagsStore: TagsStore;

  _setCallbacks(props: PropsT) {
    setCallbacks(this.authentication, {
      loadUserId: {
        loadUserId: [Handlers.handleLoadUserId],
      },
      signIn: {
        signIn: [Handlers.handleSignIn],
        goNext: [Handlers.handleGoNext],
      },
      signOut: {
        signOut: [Handlers.handleSignOut],
        goNext: [Handlers.handleGoToSignIn],
      },
      signUp: {
        signUp: [Handlers.handleSignUp],
      },
      resetPassword: {
        resetPassword: [Handlers.handleResetPassword],
      },
      changePassword: {
        changePassword: [Handlers.handleChangePassword],
      },
      activateAccount: {
        activateAccount: [Handlers.handleActivateAccount],
        goNext: [Handlers.handleGoHome],
      },
    });

    setCallbacks(this.navigation, {
      navigateToMoveList: {
        navigate: [Handlers.handleNavigateToMoveList],
      },
      navigateToMove: {
        navigate: [Handlers.handleNavigateToMove],
      },
    });

    setCallbacks(this.movesStore, {
      addMoves: {
        exit: [Handlers.handleAddMoveTags],
      },
    });

    setCallbacks(this.moveListsStore, {
      addMoveLists: {
        exit: [Handlers.handleAddMoveListTags],
      },
    });

    setCallbacks(this.votesStore, {
      castVote: {
        exit: [Handlers.handleVoteOnTip],
      },
    });
  }

  _applyPolicies(props: PropsT) {
    const policies = [
      // profiling
      Policies.handleLoadUserProfileForSignedInEmail,
      // navigation
      Policies.handleLoadSelectedMoveListFromUrl,
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
    this.tagsStore = new TagsStore();

    registerFacets(this);
    this._setCallbacks(props);
    this._applyPolicies(props);
  }
}
