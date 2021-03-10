import { setCallbacks } from 'aspiration';
import { observable } from 'mobx';
import {
  CutPointsStore,
  CutPointsStore_createMoves,
} from 'src/video/facets/CutPointsStore';
import {
  MoveListsStore,
  MoveListsStore_addMoveLists,
} from 'src/move_lists/MoveListsStore';
import { MovesStore, MovesStore_addMoves } from 'src/moves/MovesStore';
import { TipsStore } from 'src/tips/TipsStore';
import { TagsStore } from 'src/tags/TagsStore';
import { VotesStore, VotesStore_castVote } from 'src/votes/VotesStore';
import {
  handleAddMoveTags,
  handleAddMoveListTags,
  handleVoteOnTip,
  handleLoadUserProfileForSignedInEmail,
  handleLoadSelectedMoveListFromUrl,
} from 'src/app/handlers';
import { handleCreateMoves, removeAllCutPoints } from 'src/video/handlers';
import { AuthenticationStore } from 'src/session/AuthenticationStore';
import { ProfilingStore } from 'src/session/ProfilingStore';
import { NavigationStore } from 'src/session/NavigationStore';
import { facet, registerFacets } from 'facility';
import { makeCtrObservable } from 'facility-mobx';

export class AppStore {
  @observable @facet movesStore: MovesStore;
  @observable @facet moveListsStore: MoveListsStore;
  @observable @facet tagsStore: TagsStore;
  @observable @facet tipsStore: TipsStore;
  @observable @facet votesStore: VotesStore;
  @observable @facet cutPointsStore: CutPointsStore;
  @observable @facet authenticationStore: AuthenticationStore;
  @observable @facet profilingStore: ProfilingStore;
  @observable @facet navigationStore: NavigationStore;

  constructor() {
    this.authenticationStore = new AuthenticationStore();
    this.profilingStore = new ProfilingStore();
    this.movesStore = new MovesStore();
    this.moveListsStore = new MoveListsStore();
    this.tagsStore = new TagsStore();
    this.tipsStore = new TipsStore();
    this.votesStore = new VotesStore();
    this.cutPointsStore = new CutPointsStore();
    this.navigationStore = new NavigationStore(this.movesStore);

    this.tagsStore.loadKnownTags();
    this.authenticationStore.loadUserId();

    registerFacets(this);
    this._setCallbacks();
    this._applyPolicies();
    makeCtrObservable(this);
  }

  _setCallbacks() {
    const ctr = this;

    setCallbacks(this.movesStore, {
      addMoves: {
        exit(this: MovesStore_addMoves) {
          handleAddMoveTags(ctr.tagsStore, this.moves);
        },
      },
    });

    setCallbacks(this.moveListsStore, {
      addMoveLists: {
        exit(this: MoveListsStore_addMoveLists) {
          handleAddMoveListTags(ctr.tagsStore, this.moveListById);
        },
      },
    });

    setCallbacks(this.votesStore, {
      castVote: {
        exit(this: VotesStore_castVote) {
          handleVoteOnTip(ctr.votesStore, ctr.tipsStore, this.id, this.vote);
        },
      },
    });

    setCallbacks(this.cutPointsStore, {
      createMoves: {
        createMoves(this: CutPointsStore_createMoves) {
          handleCreateMoves(
            ctr.cutPointsStore,
            ctr.moveListsStore,
            ctr.movesStore,
            this.moveList,
            this.userProfile
          );
          removeAllCutPoints(ctr.cutPointsStore);
        },
      },
    });
  }

  _applyPolicies() {
    handleLoadUserProfileForSignedInEmail(this);
    handleLoadSelectedMoveListFromUrl(this);
  }
}
