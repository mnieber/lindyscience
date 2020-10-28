import { TipsStore } from 'src/tips/TipsStore';
import { Inputs, initInputs } from 'src/tips/facets/Inputs';
import { Outputs, initOutputs } from 'src/tips/facets/Outputs';
import { facet, installPolicies, registerFacets } from 'facet';
import { mapData } from 'facet-mobx';
import { Addition, initAddition } from 'facet-mobx/facets/Addition';
import { Highlight, initHighlight } from 'facet-mobx/facets/Highlight';
import { Editing, initEditing } from 'facet-mobx/facets/Editing';
import { Deletion, initDeletion } from 'facet-mobx/facets/Deletion';
import { Insertion, initInsertion } from 'facet-mobx/facets/Insertion';
import * as MobXFacets from 'facet-mobx/facets';
import * as MobXPolicies from 'facet-mobx/policies';
import * as TipsCtrHandlers from 'src/tips/handlers';
import { TipT } from 'src/tips/types';

type PropsT = {
  tipsStore: TipsStore;
};

export class TipsCtr {
  @facet addition: Addition<TipT>;
  @facet deletion: Deletion;
  @facet editing: Editing;
  @facet highlight: Highlight;
  @facet insertion: Insertion;
  @facet inputs: Inputs;
  @facet outputs: Outputs;

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

      // creation
      MobXPolicies.newItemsAreCreatedAtTheTop,
      MobXPolicies.cancelNewItemOnHighlightChange,
      MobXPolicies.newItemsAreEdited,
      MobXPolicies.newItemsAreConfirmedWhenSaved,
      MobXPolicies.newItemsAreInsertedWhenConfirmed,

      // display
      mapData([Outputs, 'preview'], [Outputs, 'display']),
    ];

    installPolicies<TipsCtr>(policies, this);
  }

  constructor(props: PropsT) {
    this.addition = initAddition(new Addition(), {
      createItem: TipsCtrHandlers.handleCreateTip(this),
    });
    this.deletion = initDeletion(new Deletion(), {
      deleteItems: TipsCtrHandlers.handleDeleteTips(this, props.tipsStore),
    });
    this.insertion = initInsertion(new Insertion(), { insertItems: () => {} });
    this.editing = initEditing(new Editing(), {
      saveItem: TipsCtrHandlers.handleSaveTip(this, props.tipsStore),
    });
    this.highlight = initHighlight(new Highlight());
    this.inputs = initInputs(new Inputs());
    this.outputs = initOutputs(new Outputs());

    registerFacets(this);
    this._applyPolicies(props);
  }
}
