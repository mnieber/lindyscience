import { TipsStore } from 'src/tips/TipsStore';
import { Inputs, initInputs } from 'src/tips/facets/Inputs';
import { Outputs, initOutputs } from 'src/tips/facets/Outputs';
import {
  ClassMemberT as CMT,
  getm,
  mapDataToFacet,
  facet,
  installPolicies,
  registerFacets,
} from 'skandha';
import { makeCtrObservable } from 'skandha-mobx';
import {
  Addition,
  Addition_add,
  Addition_cancel,
} from 'skandha-facets/Addition';
import { Highlight, Highlight_highlightItem } from 'skandha-facets/Highlight';
import {
  Editing,
  initEditing,
  Editing_save,
  Editing_cancel,
} from 'skandha-facets/Editing';
import {
  Deletion,
  initDeletion,
  Deletion_delete,
} from 'skandha-facets/Deletion';
import { Insertion, initInsertion } from 'skandha-facets/Insertion';
import * as Facets from 'skandha-facets';
import * as FacetPolicies from 'skandha-facets/policies';
import * as Handlers from 'src/tips/handlers';
import { TipT } from 'src/tips/types';
import { setCallbacks } from 'aspiration';
import { Container } from 'src/utils/Container';

type PropsT = {
  tipsStore: TipsStore;
};

export class TipsCtr extends Container {
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
          FacetPolicies.newItemsAreCreatedAtTheTop(ctr.addition);
          return Handlers.handleCreateTip(ctr, this.values);
        },
        createItem_post(this: Addition_add<TipT>) {
          FacetPolicies.highlightNewItem(ctr.addition);
          FacetPolicies.editingSetEnabled(ctr.addition);
        },
      },
      cancel: {
        exit(this: Addition_cancel<TipT>) {
          FacetPolicies.editingSetDisabled(ctr.addition);
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
          FacetPolicies.newItemsAreConfirmedOnEditingSave(
            ctr.editing,
            this.values
          );
        },
      },
      cancel: {
        enter(this: Editing_cancel) {
          FacetPolicies.newItemsAreCancelledOnEditingCancel(ctr.editing);
        },
      },
    });

    setCallbacks(this.highlight, {
      highlightItem: {
        enter(this: Highlight_highlightItem) {
          FacetPolicies.cancelNewItemOnHighlightChange(ctr.highlight, this.id);
        },
      },
    });
  }

  _applyPolicies(props: PropsT) {
    const Inputs_items = [Inputs, 'tips'] as CMT;
    const Outputs_itemById = [Outputs, 'tipById'] as CMT;

    const policies = [
      // highlight
      Facets.highlightActsOnItems(getm(Outputs_itemById)),

      // insertion
      Facets.insertionActsOnItems(getm(Inputs_items)),
      FacetPolicies.createInsertionPreview(
        [FacetPolicies.DragSourceFromNewItem],
        [Outputs, 'preview']
      ),

      // display
      mapDataToFacet(getm([Outputs, 'preview']), [Outputs, 'display']),
    ];

    installPolicies<TipsCtr>(policies, this);
  }

  constructor(props: PropsT) {
    super();

    registerFacets(this);
    this._setCallbacks(props);
    this._applyPolicies(props);
    makeCtrObservable(this);
  }
}
