import { ProfilingStore } from 'src/session/ProfilingStore';
import { Inputs } from 'src/movelists/facets/Inputs';
import { Outputs } from 'src/movelists/facets/Outputs';
import { NavigationStore } from 'src/session/NavigationStore';
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
import { Labelling, LabellingCbs } from 'skandha-facets/Labelling';
import { Addition, AdditionCbs } from 'skandha-facets/Addition';
import { Editing, EditingCbs } from 'skandha-facets/Editing';
import { Highlight, HighlightCbs } from 'skandha-facets/Highlight';
import { Insertion } from 'skandha-facets/Insertion';
import {
  Selection,
  handleSelectItem,
  SelectionCbs,
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
        saveItem(this: EditingCbs['save']) {
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
        refreshView() {
          props.navigationStore.navigateToMoveList(ctr.highlight.item);
        },
      },
      cancel: {
        enter() {
          FacetPolicies.newItemsAreCancelledOnEditingCancel(ctr.editing);
        },
      },
    } as EditingCbs);

    setCallbacks(this.highlight, {
      highlightItem: {
        enter(this: HighlightCbs['highlightItem']) {
          FacetPolicies.cancelNewItemOnHighlightChange(ctr.highlight, this.id);
        },
        exit() {
          Handlers.handleNavigateToHighlightedItem(
            ctr.highlight,
            props.navigationStore
          );
        },
      },
    } as HighlightCbs);

    setCallbacks(this.labelling, {
      setLabel: {
        saveIds(label: string, ids: Array<UUID>) {
          Handlers.handleSaveLabels(
            ctr.labelling,
            props.profilingStore,
            label,
            ids
          );
        },
      },
    } as LabellingCbs);

    setCallbacks(this.selection, {
      selectItem: {
        selectItem(this: SelectionCbs['selectItem']) {
          handleSelectItem(ctr.selection, this.selectionParams);
          FacetPolicies.highlightFollowsSelection(
            ctr.selection,
            this.selectionParams
          );
        },
      },
    } as SelectionCbs);
  }

  _applyPolicies(props: PropsT) {
    const Inputs_items = [Inputs, 'moveLists'] as CMT;
    const Outputs_display = [Outputs, 'display'] as CMT;
    const Outputs_itemById = [Outputs, 'moveListById'] as CMT;
    const Outputs_ids = [Outputs, 'moveListIds'] as CMT;
    const Inputs_moveListsFollowing = [Inputs, 'moveListsFollowing'] as CMT;

    const policies = [
      // selection
      Facets.selectionUsesSelectableIds(getm(Outputs_ids)),
      Facets.selectionUsesItemLookUpTable(getm(Outputs_itemById)),

      // highlight
      Facets.highlightUsesItemLookUpTable(getm(Outputs_itemById)),

      // insertion
      Facets.insertionUsesInputItems(getm(Inputs_items)),
      FacetPolicies.insertionPreviewUsesDragSources([
        FacetPolicies.DragSourceFromNewItem,
      ]),
      mapDataToFacet(Outputs_display, getm([Insertion, 'preview'])),

      // labelling
      MoveListsCtrPolicies.labellingReceivesIds(
        Inputs_moveListsFollowing,
        'following'
      ),
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
