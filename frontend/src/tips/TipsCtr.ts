import { TipsStore } from 'src/tips/TipsStore';
import { Inputs, initInputs } from 'src/tips/facets/Inputs';
import { Outputs, initOutputs } from 'src/tips/facets/Outputs';
import {
  setCallbacks,
  facet,
  installPolicies,
  registerFacets,
  ret,
} from 'facility';
import { mapData } from 'facility-mobx';
import { Addition } from 'facility-mobx/facets/Addition';
import { Highlight } from 'facility-mobx/facets/Highlight';
import { Editing, initEditing } from 'facility-mobx/facets/Editing';
import { Deletion, initDeletion } from 'facility-mobx/facets/Deletion';
import { Insertion, initInsertion } from 'facility-mobx/facets/Insertion';
import * as MobXFacets from 'facility-mobx/facets';
import * as MobXPolicies from 'facility-mobx/policies';
import * as Handlers from 'src/tips/handlers';
import { TipT } from 'src/tips/types';

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
    setCallbacks(this.addition, {
      add: {
        createItem: [
          MobXPolicies.newItemsAreCreatedAtTheTop,
          Handlers.handleCreateTip(this),
        ],
        createItem_post: [
          MobXPolicies.highlightNewItem,
          MobXPolicies.editingSetEnabled,
        ],
      },
      cancel: {
        enter: [MobXPolicies.editingSetDisabled],
      },
    });

    setCallbacks(this.deletion, {
      delete: {
        deleteItems: [Handlers.handleDeleteTips(props.tipsStore)],
      },
    });

    setCallbacks(this.editing, {
      save: {
        saveItem: [
          Handlers.handleSaveTip(this, props.tipsStore),
          MobXPolicies.newItemsAreConfirmedOnEditingSave,
        ],
      },
      cancel: {
        enter: [MobXPolicies.newItemsAreCancelledOnEditingCancel],
      },
    });

    setCallbacks(this.highlight, {
      highlightItem: {
        enter: [MobXPolicies.cancelNewItemOnHighlightChange],
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
