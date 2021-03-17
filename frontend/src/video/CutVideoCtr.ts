import { Display, initDisplay } from 'src/moves/MoveCtr/facets/Display';
import { facet, installPolicies, registerFacets } from 'skandha';
import { makeCtrObservable } from 'skandha-mobx';
import { updateVideoWidth } from 'src/moves/MoveCtr/policies/updateVideoWidth';
import { initVideoCtrFromCutPointsStr } from 'src/moves/MoveCtr/policies/initVideoCtrFromCutPointsStr';
import { Inputs } from 'src/video/facets/Inputs';
import { CutPointsStore } from 'src/video/facets/CutPointsStore';
import { Addition, AdditionCbs } from 'skandha-facets/Addition';
import { Editing, Editing_save } from 'skandha-facets/Editing';
import { Deletion, Deletion_delete } from 'skandha-facets/Deletion';
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
  @facet addition: Addition = new Addition();
  @facet editing: Editing = new Editing();
  @facet deletion: Deletion = new Deletion();
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
        createItem(this: AdditionCbs['add']) {
          return Handlers.handleCreateCutPoint(
            ctr.videoController,
            this.values
          );
        },
        highlightNewItem() {
          ctr.addition.confirm();
        },
      },
      confirm: {
        confirm() {
          Handlers.insertCutPointWhenConfirmed(
            ctr.addition,
            props.cutPointsStore
          );
        },
      },
    } as AdditionCbs);

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
