import { Display, initDisplay } from 'src/moves/MoveCtr/facets/Display';
import { facet, installPolicies, registerFacets } from 'skandha';
import { makeCtrObservable } from 'skandha-mobx';
import { updateVideoWidth } from 'src/moves/MoveCtr/policies/updateVideoWidth';
import { initVideoCtrFromCutPointsStr } from 'src/moves/MoveCtr/policies/initVideoCtrFromCutPointsStr';
import { Inputs } from 'src/video/facets/Inputs';
import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import {
  Addition,
  initAddition,
  Addition_add,
  Addition_confirm,
} from 'skandha-facets/Addition';
import { Editing, initEditing, Editing_save } from 'skandha-facets/Editing';
import {
  Deletion,
  initDeletion,
  Deletion_delete,
} from 'skandha-facets/Deletion';
import { setCallbacks } from 'aspiration';
import * as Handlers from 'src/video/handlers';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { Container } from 'src/utils/Container';

export type PropsT = {
  rootDivId: string;
  cutPointsStore: CutPointsStore;
};

export class CutVideoContainer extends Container {
  @facet inputs: Inputs = new Inputs();
  @facet display: Display;
  @facet addition: Addition = initAddition(new Addition());
  @facet editing: Editing = initEditing(new Editing());
  @facet deletion: Deletion = initDeletion(new Deletion());
  @facet videoController: VideoController = new VideoController();

  _applyPolicies(props: PropsT) {
    const policies = [
      updateVideoWidth,
      initVideoCtrFromCutPointsStr(props.cutPointsStore),
    ];

    installPolicies<CutVideoContainer>(policies, this);
  }

  _setCallbacks(props: PropsT) {
    const ctr = this;

    setCallbacks(this.addition, {
      add: {
        createItem(this: Addition_add<any>) {
          return Handlers.handleCreateCutPoint(
            ctr.videoController,
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
    super();

    this.display = initDisplay(new Display(), props.rootDivId);

    registerFacets(this);
    this._setCallbacks(props);
    this._applyPolicies(props);
    makeCtrObservable(this);
  }
}
