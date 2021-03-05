import { TipsStore } from 'src/tips/TipsStore';
import { Inputs, initInputs } from 'src/tips/facets/Inputs';
import { Outputs, initOutputs } from 'src/tips/facets/Outputs';
import { facet, installPolicies, registerFacets } from 'facility';
import { mapData } from 'facility-mobx';
import {
  Addition,
  Addition_add,
  Addition_cancel,
} from 'facility-mobx/facets/Addition';
import {
  Highlight,
  Highlight_highlightItem,
} from 'facility-mobx/facets/Highlight';
import {
  Editing,
  initEditing,
  Editing_save,
  Editing_cancel,
} from 'facility-mobx/facets/Editing';
import {
  Deletion,
  initDeletion,
  Deletion_delete,
} from 'facility-mobx/facets/Deletion';
import { Insertion, initInsertion } from 'facility-mobx/facets/Insertion';
import * as MobXFacets from 'facility-mobx/facets';
import * as MobXPolicies from 'facility-mobx/policies';
import * as Handlers from 'src/tips/handlers';
import { TipT } from 'src/tips/types';
import { setCallbacks } from 'aspiration';

type PropsT = {
  tipsStore: TipsStore;
};

export class TipsCtr {
  @facet addition: Addition<TipT> = new Addition<TipT>();
  @facet deletion: Deletion = initDeletion(new Deletion());
  @facet editing: Editing = initEditing(new Editing());
  @facet highlight: Highlight = new Highlight();
  @facet insertion: Insertion = initInsertion(new Insertion());
  @facet inputs: Inputs = initInputs(new Inputs());
  @facet outputs: Outputs = initOutputs(new Outputs());

  _setCallbacks(props: PropsT) {
    const ctr = this;

    setCallbacks(this.addition, {
      add: {
        createItem(this: Addition_add<TipT>) {
          MobXPolicies.newItemsAreCreatedAtTheTop(ctr.addition);
          return Handlers.handleCreateTip(ctr);
        },
        createItem_post(this: Addition_add<TipT>) {
          MobXPolicies.highlightNewItem(ctr.addition);
          MobXPolicies.editingSetEnabled(ctr.addition);
        },
      },
      cancel: {
        enter(this: Addition_cancel<TipT>) {
          MobXPolicies.editingSetDisabled(ctr.addition);
        },
      },
    });

    setCallbacks(this.deletion, {
      delete: {
        deleteItems(this: Deletion_delete) {
          Handlers.handleDeleteTips(props.tipsStore, this.itemIds);
        },
      },
    });

    setCallbacks(this.editing, {
      save: {
        saveItem(this: Editing_save) {
          Handlers.handleSaveTip(ctr, props.tipsStore);
          MobXPolicies.newItemsAreConfirmedOnEditingSave(
            ctr.editing,
            this.values
          );
        },
      },
      cancel: {
        enter(this: Editing_cancel) {
          MobXPolicies.newItemsAreCancelledOnEditingCancel(ctr.editing);
        },
      },
    });

    setCallbacks(this.highlight, {
      highlightItem: {
        enter(this: Highlight_highlightItem) {
          MobXPolicies.cancelNewItemOnHighlightChange(ctr.highlight, this.id);
        },
      },
    });
  }

  _applyPolicies(props: PropsT) {
    const inputItems = [Inputs, 'tips'];
    const itemById = [Outputs, 'tipById'];

    const policies = [
      // highlight
      MobXFacets.highlightActsOnItems(itemById),

      // insertion
      MobXFacets.insertionActsOnItems(inputItems),
      MobXPolicies.createInsertionPreview(
        [MobXPolicies.DragSourceFromNewItem],
        [Outputs, 'preview']
      ),

      // display
      mapData([Outputs, 'preview'], [Outputs, 'display']),
    ];

    installPolicies<TipsCtr>(policies, this);
  }

  constructor(props: PropsT) {
    registerFacets(this);
    this._setCallbacks(props);
    this._applyPolicies(props);
  }
}
