import { setCallbacks } from 'aspiration';
import { makeObservable, observable } from 'mobx';
import {
  CutPointsStore,
  CutPointsStore_createMoves,
} from 'src/video/facets/CutPointsStore';
import {
  MoveListsStore,
  MoveListsStore_addMoveLists,
} from 'src/movelists/MoveListsStore';
import { MovesStore, MovesStore_addMoves } from 'src/moves/MovesStore';
import { TipsStore } from 'src/tips/TipsStore';
import { TagsStore } from 'src/tags/TagsStore';
import { VotesStore, VotesStore_castVote } from 'src/votes/VotesStore';
import {
  handleAddMoveTags,
  handleAddMoveListTags,
  handleVoteOnTip,
  handleLoadUserProfileForSignedInEmail,
  handleSignOut,
  handleLoadSelectedMoveListFromUrl,
} from 'src/app/handlers';
import { handleCreateMoves, removeAllCutPoints } from 'src/video/handlers';
import { AuthenticationStore } from 'src/session/AuthenticationStore';
import { ProfilingStore } from 'src/session/ProfilingStore';
import {
  NavigationStore,
  Navigation_requestData,
} from 'src/session/NavigationStore';

export class AppStore {
  @observable movesStore: MovesStore;
  @observable moveListsStore: MoveListsStore;
  @observable tagsStore: TagsStore;
  @observable tipsStore: TipsStore;
  @observable votesStore: VotesStore;
  @observable cutPointsStore: CutPointsStore;
  @observable authenticationStore: AuthenticationStore;
  @observable profilingStore: ProfilingStore;
  @observable navigationStore: NavigationStore;

  constructor() {
    makeObservable(this);

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

    this._setCallbacks();
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

    setCallbacks(this.navigationStore, {
      requestData: {
        loadData(this: Navigation_requestData) {
          handleLoadSelectedMoveListFromUrl(ctr, this.dataRequest);
        },
      },
    });

    this.authenticationStore.signal.add((event) => {
      if (
        event.topic === 'LoadUserId.Succeeded' ||
        event.topic === 'SignIn.Succeeded' ||
        event.topic === 'SignOut.Succeeded'
      ) {
        if (this.authenticationStore.signedInUserId === 'anonymous') {
          handleSignOut(ctr);
        } else {
          handleLoadUserProfileForSignedInEmail(ctr);
        }
      }
    });
  }
}
