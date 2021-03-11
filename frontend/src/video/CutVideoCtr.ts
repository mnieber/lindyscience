import { Display, initDisplay } from 'src/moves/MoveCtr/facets/Display';
import { facet, installPolicies, registerFacets } from 'facility';
import { makeCtrObservable } from 'facility-mobx';
import { updateVideoWidth } from 'src/moves/MoveCtr/policies/updateVideoWidth';
import { Inputs, initInputs } from 'src/video/facets/Inputs';
import { CutPointsStore } from 'src/video/facets/CutPointsStore';
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
  cutPointsStore: CutPointsStore;
};

export class CutVideoContainer {
  @facet inputs: Inputs;
  @facet display: Display;
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
          return Handlers.handleCreateCutPoint(
            props.cutPointsStore,
            this.values
          );
        },
        createItem_post(this: Addition_add<any>) {
          ctr.addition.confirm();
        },
      },
      confirm: {
        confirm(this: Addition_confirm<any>) {
          Handlers.insertCutPointWhenConfirmed(
            ctr.addition,
            props.cutPointsStore
          );
        },
      },
    });

    setCallbacks(this.editing, {
      save: {
        saveItem(this: Editing_save) {
          Handlers.handleSaveCutPoint(props.cutPointsStore, this.values);
        },
      },
    });

    setCallbacks(this.deletion, {
      delete: {
        deleteItems(this: Deletion_delete) {
          Handlers.handleDeleteCutPoints(props.cutPointsStore, this.itemIds);
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
    makeCtrObservable(this);
  }
}
