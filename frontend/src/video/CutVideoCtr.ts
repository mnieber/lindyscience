import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { Display, initDisplay } from 'src/moves/MoveCtr/facets/Display';
import { setCallbacks, facet, installPolicies, registerFacets } from 'facility';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/move_lists/types';
import { updateVideoWidth } from 'src/moves/MoveCtr/policies/updateVideoWidth';
import { Inputs, initInputs } from 'src/video/facets/Inputs';
import { Addition, initAddition } from 'facility-mobx/facets/Addition';
import { Editing, initEditing } from 'facility-mobx/facets/Editing';
import { Deletion, initDeletion } from 'facility-mobx/facets/Deletion';
import * as Handlers from 'src/video/handlers';

export type PropsT = {
  rootDivId: string;
  saveMoves: (moves: Array<MoveT>, moveList: MoveListT) => any;
};

export class CutVideoContainer {
  @facet inputs: Inputs;
  @facet display: Display;
  @facet cutPointsStore: CutPointsStore = new CutPointsStore();
  @facet addition: Addition = initAddition(new Addition());
  @facet editing: Editing = initEditing(new Editing());
  @facet deletion: Deletion = initDeletion(new Deletion());

  _applyPolicies(props: PropsT) {
    const policies = [updateVideoWidth];

    installPolicies<CutVideoContainer>(policies, this);
  }

  _setCallbacks(props: PropsT) {
    setCallbacks(this.addition, {
      add: {
        createItem: [Handlers.handleCreateCutPoint],
        createItem_post: [() => this.addition.confirm()],
      },
      confirm: {
        confirm: [Handlers.insertCutPointWhenConfirmed],
      },
    });

    setCallbacks(this.editing, {
      save: {
        saveItem: [Handlers.handleSaveCutPoint],
      },
    });

    setCallbacks(this.deletion, {
      delete: {
        deleteItems: [Handlers.handleDeleteCutPoints],
      },
    });

    setCallbacks(this.cutPointsStore, {
      createMoves: {
        createMoves: [Handlers.handleCreateMoves(props.saveMoves)],
        createMoves_post: [Handlers.removeAllCutPoints],
      },
    });
  }

  constructor(props: PropsT) {
    this.inputs = initInputs(new Inputs());
    this.display = initDisplay(new Display(), props.rootDivId);

    registerFacets(this);
    this._setCallbacks(props);
    this._applyPolicies(props);
  }
}
