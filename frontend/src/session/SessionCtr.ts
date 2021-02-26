import {
  Authentication,
  initAuthentication,
  Authentication_activateAccount,
  Authentication_changePassword,
  Authentication_loadUserId,
  Authentication_resetPassword,
  Authentication_signIn,
  Authentication_signOut,
  Authentication_signUp,
} from 'src/session/facets/Authentication';
import * as Policies from 'src/session/policies';
import * as Handlers from 'src/session/handlers';
import {
  MoveListsStore,
  MoveListsStore_addMoveLists,
} from 'src/move_lists/MoveListsStore';
import { MovesStore, MovesStore_addMoves } from 'src/moves/MovesStore';
import { TipsStore } from 'src/tips/TipsStore';
import { TagsStore } from 'src/tags/TagsStore';
import { VotesStore, VotesStore_castVote } from 'src/votes/VotesStore';
import { Display, initDisplay } from 'src/session/facets/Display';
import {
  Navigation,
  initNavigation,
  Navigation_navigateToMoveList,
  Navigation_navigateToMove,
} from 'src/session/facets/Navigation';
import { Profiling, initProfiling } from 'src/session/facets/Profiling';
import { facet, installPolicies, registerFacets } from 'facility';
import { setCallbacks } from 'aspiration';

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
    const ctr = this;

    setCallbacks(this.authentication, {
      loadUserId: {
        loadUserId(this: Authentication_loadUserId) {
          return Handlers.handleLoadUserId();
        },
      },
      signIn: {
        signIn(this: Authentication_signIn) {
          return Handlers.handleSignIn(
            this.userId,
            this.password,
            this.rememberMe
          );
        },
        goNext(this: Authentication_signIn) {
          Handlers.handleGoNext();
        },
      },
      signOut: {
        signOut(this: Authentication_signOut) {
          return Handlers.handleSignOut();
        },
        goNext(this: Authentication_signOut) {
          Handlers.handleGoToSignIn();
        },
      },
      signUp: {
        signUp(this: Authentication_signUp) {
          return Handlers.handleSignUp(this.email, this.userId, this.password);
        },
      },
      resetPassword: {
        resetPassword(this: Authentication_resetPassword) {
          return Handlers.handleResetPassword(this.email);
        },
      },
      changePassword: {
        changePassword(this: Authentication_changePassword) {
          return Handlers.handleChangePassword(this.password, this.token);
        },
      },
      activateAccount: {
        activateAccount(this: Authentication_activateAccount) {
          return Handlers.handleActivateAccount(this.token);
        },
        goNext(this: Authentication_activateAccount) {
          Handlers.handleGoHome();
        },
      },
    });

    setCallbacks(this.navigation, {
      navigateToMoveList: {
        navigate(this: Navigation_navigateToMoveList) {
          Handlers.handleNavigateToMoveList(ctr.navigation, this.moveList);
        },
      },
      navigateToMove: {
        navigate(this: Navigation_navigateToMove) {
          Handlers.handleNavigateToMove(
            ctr.navigation,
            this.moveList,
            this.move
          );
        },
      },
      requestData: {},
    });

    setCallbacks(this.movesStore, {
      addMoves: {
        exit(this: MovesStore_addMoves) {
          Handlers.handleAddMoveTags(ctr.movesStore, this.moves);
        },
      },
    });

    setCallbacks(this.moveListsStore, {
      addMoveLists: {
        exit(this: MoveListsStore_addMoveLists) {
          Handlers.handleAddMoveListTags(ctr.moveListsStore, this.moveListById);
        },
      },
    });

    setCallbacks(this.votesStore, {
      castVote: {
        exit(this: VotesStore_castVote) {
          Handlers.handleVoteOnTip(ctr.votesStore, this.id, this.vote);
        },
      },
      setVotes: {},
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
