import {
  CutPointsStore,
  CutPointsStore_createMoves,
} from 'src/video/facets/CutPointsStore';
import { Display, initDisplay } from 'src/moves/MoveCtr/facets/Display';
import { facet, installPolicies, registerFacets } from 'facility';
import { MoveT } from 'src/moves/types';
import { MoveListT } from 'src/move_lists/types';
import { updateVideoWidth } from 'src/moves/MoveCtr/policies/updateVideoWidth';
import { Inputs, initInputs } from 'src/video/facets/Inputs';
import {
  Addition,
  initAddition,
  Addition_add,
  Addition_confirm,
} from 'facility-mobx/facets/Addition';
import {
  Editing,
  initEditing,
  Editing_save,
} from 'facility-mobx/facets/Editing';
import {
  Deletion,
  initDeletion,
  Deletion_delete,
} from 'facility-mobx/facets/Deletion';
import { setCallbacks } from 'aspiration';
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
    const ctr = this;

    setCallbacks(this.addition, {
      add: {
        createItem(this: Addition_add<any>) {
          Handlers.handleCreateCutPoint(ctr.addition, this.values);
        },
        createItem_post(this: Addition_add<any>) {
          ctr.addition.confirm();
        },
      },
      confirm: {
        confirm(this: Addition_confirm<any>) {
          Handlers.insertCutPointWhenConfirmed(ctr.addition);
        },
      },
    });

    setCallbacks(this.editing, {
      save: {
        saveItem(this: Editing_save) {
          Handlers.handleSaveCutPoint(ctr.editing, this.values);
        },
      },
    });

    setCallbacks(this.deletion, {
      delete: {
        deleteItems(this: Deletion_delete) {
          Handlers.handleDeleteCutPoints(ctr.deletion, this.itemIds);
        },
      },
    });

    setCallbacks(this.cutPointsStore, {
      createMoves: {
        createMoves(this: CutPointsStore_createMoves) {
          Handlers.handleCreateMoves(ctr.cutPointsStore, props.saveMoves);
          Handlers.removeAllCutPoints(ctr.cutPointsStore);
        },
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
