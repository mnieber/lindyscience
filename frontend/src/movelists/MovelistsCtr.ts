import { ProfilingStore } from 'src/session/ProfilingStore';
import { Inputs } from 'src/movelists/facets/Inputs';
import { Outputs } from 'src/movelists/facets/Outputs';
import { NavigationStore } from 'src/session/NavigationStore';
import { getIds } from 'src/app/utils';
import { Container } from 'src/utils/Container';
import {
  getm,
  mapDataToFacet,
  facet,
  installPolicies,
  registerFacets,
  ClassMemberT as CMT,
} from 'skandha';
import { setCallbacks } from 'aspiration';
import { makeCtrObservable } from 'skandha-mobx';
import { UUID } from 'src/kernel/types';
import { Labelling, Labelling_setLabel } from 'skandha-facets/Labelling';
import { Addition, AdditionCbs } from 'skandha-facets/Addition';
import { Editing, Editing_cancel, Editing_save } from 'skandha-facets/Editing';
import { Highlight, Highlight_highlightItem } from 'skandha-facets/Highlight';
import { Insertion } from 'skandha-facets/Insertion';
import {
  Selection,
  handleSelectItem,
  Selection_selectItem,
} from 'skandha-facets/Selection';
import { MoveListsStore } from 'src/movelists/MoveListsStore';
import { MoveListT } from 'src/movelists/types';
import * as Facets from 'skandha-facets';
import * as FacetPolicies from 'skandha-facets/policies';
import * as MoveListsCtrPolicies from 'src/movelists/policies';
import * as Handlers from 'src/movelists/handlers';

type PropsT = {
  navigationStore: NavigationStore;
  profilingStore: ProfilingStore;
  moveListsStore: MoveListsStore;
};

export class MoveListsContainer extends Container {
  @facet addition: Addition<MoveListT> = new Addition<MoveListT>();
  @facet editing: Editing = new Editing();
  @facet highlight: Highlight = new Highlight();
  @facet insertion: Insertion = new Insertion();
  @facet inputs: Inputs = new Inputs();
  @facet outputs: Outputs = new Outputs();
  @facet selection: Selection = new Selection();
  @facet labelling: Labelling = new Labelling();

  _setCallbacks(props: PropsT) {
    const ctr = this;

    setCallbacks(this.addition, {
      add: {
        storeLocation() {
          props.navigationStore.storeLocation();
          FacetPolicies.newItemsAreAddedBelowTheHighlight(ctr.addition);
        },
        createItem(this: AdditionCbs<MoveListT>['add']) {
          return Handlers.handleCreateMoveList(ctr, this.values);
        },
        highlightNewItem() {
          FacetPolicies.highlightNewItem(ctr.addition);
          FacetPolicies.editingSetEnabled(ctr.addition);
        },
      },
      confirm: {
        confirm() {
          MoveListsCtrPolicies.newItemsAreFollowedWhenConfirmed(ctr.addition);
        },
      },
      cancel: {
        restoreLocation() {
          FacetPolicies.editingSetDisabled(ctr.addition);
          props.navigationStore.restoreLocation();
        },
      },
    } as AdditionCbs<MoveListT>);

    setCallbacks(this.editing, {
      save: {
        saveItem(this: Editing_save) {
          Handlers.handleSaveMoveList(
            ctr.editing,
            props.moveListsStore,
            this.values
          );
          FacetPolicies.newItemsAreConfirmedOnEditingSave(
            ctr.editing,
            this.values
          );
        },
        exit(this: Editing_save) {
          props.navigationStore.navigateToMoveList(ctr.highlight.item);
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
        exit(this: Highlight_highlightItem) {
          Handlers.handleNavigateToHighlightedItem(
            ctr.highlight,
            props.navigationStore
          );
        },
      },
    });

    setCallbacks(this.labelling, {
      setLabel: {
        saveIds(this: Labelling_setLabel, label: string, ids: Array<UUID>) {
          Handlers.handleSaveLabels(
            ctr.labelling,
            props.profilingStore,
            label,
            ids
          );
        },
      },
    });

    setCallbacks(this.selection, {
      selectItem: {
        selectItem(this: Selection_selectItem) {
          handleSelectItem(ctr.selection, this.itemSelectedProps);
          FacetPolicies.highlightFollowsSelection(
            ctr.selection,
            this.itemSelectedProps
          );
        },
      },
    });
  }

  _applyPolicies(props: PropsT) {
    const Inputs_items = [Inputs, 'moveLists'] as CMT;
    const Outputs_itemById = [Outputs, 'moveListById'] as CMT;
    const Outputs_display = [Outputs, 'display'] as CMT;
    const Inputs_moveListsFollowing = [Inputs, 'moveListsFollowing'] as CMT;
    const Selection_selectableIds = [Selection, 'selectableIds'] as CMT;

    const policies = [
      // selection
      Facets.selectionActsOnItems(getm(Outputs_itemById)),

      // highlight
      Facets.highlightActsOnItems(getm(Outputs_itemById)),

      // insertion
      Facets.insertionActsOnItems(getm(Inputs_items)),
      FacetPolicies.createInsertionPreview(
        [FacetPolicies.DragSourceFromNewItem],
        Outputs_display
      ),

      // labelling
      MoveListsCtrPolicies.labellingReceivesIds(
        Inputs_moveListsFollowing,
        'following'
      ),

      // display
      mapDataToFacet(getm(Outputs_display), Selection_selectableIds, getIds),
    ];

    installPolicies<MoveListsContainer>(policies, this);
  }

  constructor(props: PropsT) {
    super();

    registerFacets(this);
    this._setCallbacks(props);
    this._applyPolicies(props);
    makeCtrObservable(this);
  }
}
