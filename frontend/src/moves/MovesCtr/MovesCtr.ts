import { setCallbacks } from 'aspiration';
import {
  ClassMemberT as CMT,
  facet,
  getm,
  installPolicies,
  mapDataToFacet,
  registerFacets,
} from 'skandha';
import * as Facets from 'skandha-facets';
import { Addition, AdditionCbs } from 'skandha-facets/Addition';
import { DragAndDrop, DragAndDropCbs } from 'skandha-facets/DragAndDrop';
import { Editing, EditingCbs } from 'skandha-facets/Editing';
import { Filtering, FilteringCbs } from 'skandha-facets/Filtering';
import { ClickToSelectItems, SelectWithKeys } from 'skandha-facets/handlers';
import { Highlight, HighlightCbs } from 'skandha-facets/Highlight';
import { Insertion, InsertionCbs } from 'skandha-facets/Insertion';
import * as FacetPolicies from 'skandha-facets/policies';
import {
  handleSelectItem,
  Selection,
  SelectionCbs,
} from 'skandha-facets/Selection';
import { makeCtrObservable } from 'skandha-mobx';
import { MoveListsStore } from 'src/movelists/MoveListsStore';
import { Clipboard } from 'src/moves/MovesCtr/facets/Clipboard';
import { EditingPrivateData } from 'src/moves/MovesCtr/facets/EditingPrivateData';
import { Inputs } from 'src/moves/MovesCtr/facets/Inputs';
import { Outputs } from 'src/moves/MovesCtr/facets/Outputs';
import * as Handlers from 'src/moves/MovesCtr/handlers';
import { MovesStore } from 'src/moves/MovesStore';
import { MoveT } from 'src/moves/types';
import { NavigationStore } from 'src/app/NavigationStore';
import { Container } from 'src/utils/Container';

type PropsT = {
  moveListsStore: MoveListsStore;
  movesStore: MovesStore;
  navigationStore: NavigationStore;
  scrollIntoView: (moveId: string) => void;
};

export class MovesContainer extends Container {
  @facet addition: Addition<MoveT> = new Addition<MoveT>();
  @facet editing: Editing = new Editing();
  @facet editingPrivateData: EditingPrivateData = new EditingPrivateData();
  @facet filtering: Filtering = new Filtering();
  @facet highlight: Highlight = new Highlight();
  @facet inputs: Inputs = new Inputs();
  @facet insertion: Insertion = new Insertion();
  @facet outputs: Outputs = new Outputs();
  @facet selection: Selection = new Selection();
  @facet dragAndDrop: DragAndDrop = new DragAndDrop();

  clipboard: Clipboard;

  handlerSelectWithKeys = new SelectWithKeys({ container: this });
  handlerClick = new ClickToSelectItems({ selection: this.selection });

  _setCallbacks(props: PropsT) {
    const ctr = this;
    const navigateToMove = props.navigationStore.navigateToMove.bind(
      props.navigationStore
    );

    setCallbacks(this.addition, {
      add: {
        storeLocation() {
          props.navigationStore.storeLocation();
          FacetPolicies.filteringIsDisabledOnNewItem(ctr.addition);
        },
        createItem(this: AdditionCbs<MoveT>['add']) {
          FacetPolicies.newItemsAreAddedBelowTheHighlight(ctr.addition);
          return Handlers.handleCreateMove(ctr.addition, this.values);
        },
        highlightNewItem() {
          FacetPolicies.highlightNewItem(ctr.addition);
          FacetPolicies.editingSetEnabled(ctr.addition);
        },
      },
      confirm: {
        confirm() {
          FacetPolicies.newItemsAreInsertedWhenConfirmed(ctr.addition);
        },
      },
      cancel: {
        restoreLocation() {
          FacetPolicies.editingSetDisabled(ctr.addition);
          props.navigationStore.restoreLocation();
        },
      },
    } as AdditionCbs<MoveT>);

    setCallbacks(this.dragAndDrop, {
      drop: {
        drop(this: DragAndDropCbs['drop']) {
          FacetPolicies.selectionIsInsertedOnDragAndDrop(
            ctr.dragAndDrop,
            this.dropPosition
          );
        },
      },
    } as DragAndDropCbs);

    setCallbacks(this.editing, {
      save: {
        saveItem(this: EditingCbs['save']) {
          Handlers.handleSaveMove(ctr.editing, props.movesStore, this.values);
          FacetPolicies.newItemsAreConfirmedOnEditingSave(
            ctr.editing,
            this.values
          );
        },
        refreshView() {
          Handlers.handleNavigateToSavedMove(ctr.editing, navigateToMove);
        },
      },
      cancel: {
        enter() {
          FacetPolicies.newItemsAreCancelledOnEditingCancel(ctr.editing);
        },
      },
    } as EditingCbs);

    setCallbacks(this.editingPrivateData, {
      save: {
        saveItem(this: EditingCbs['save']) {
          Handlers.handleSavePrivateData(
            ctr.editing,
            props.movesStore,
            this.values
          );
        },
      },
    });

    setCallbacks(this.highlight, {
      highlightItem: {
        enter(this: HighlightCbs['highlightItem']) {
          FacetPolicies.cancelNewItemOnHighlightChange(ctr.highlight, this.id);
        },
        scrollItemIntoView(this: HighlightCbs['highlightItem']) {
          Handlers.handleNavigateToHighlightedItem(ctr, props.navigationStore);
          props.scrollIntoView(this.id);
        },
      },
    } as HighlightCbs);

    setCallbacks(this.filtering, {
      apply: {
        exit(this: FilteringCbs['apply']) {
          FacetPolicies.highlightIsCorrectedOnFilterChange(ctr.filtering);
        },
      },
    } as FilteringCbs);

    setCallbacks(this.insertion, {
      insertItems: {
        insertItems(moves: MoveT[]) {
          Handlers.handleInsertMoves(
            ctr.insertion,
            props.moveListsStore,
            moves
          );
        },
      },
    } as InsertionCbs);

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
    const Inputs_moves = [Inputs, 'moves'] as CMT;
    const Outputs_itemById = [Outputs, 'moveById'] as CMT;
    const Outputs_ids = [Outputs, 'moveIds'] as CMT;
    const Insertion_preview = [Insertion, 'preview'] as CMT;
    const Outputs_display = [Outputs, 'display'] as CMT;
    const Filtering_filteredItems = [Filtering, 'filteredItems'] as CMT;

    const policies = [
      // selection
      Facets.selectionUsesSelectableIds(getm(Outputs_ids)),
      Facets.selectionUsesItemLookUpTable(getm(Outputs_itemById)),

      // highlight
      Facets.highlightUsesItemLookUpTable(getm(Outputs_itemById)),

      // insertion
      Facets.insertionUsesInputItems(getm(Inputs_moves)),
      FacetPolicies.insertionPreviewUsesDragSources([
        FacetPolicies.DragSourceFromNewItem,
      ]),

      // filtering
      Facets.filteringUsesInputItems(getm(Insertion_preview)),

      // display
      mapDataToFacet(Outputs_display, getm(Filtering_filteredItems)),
    ];

    installPolicies<MovesContainer>(policies, this);
  }

  private _createClipboard(props: PropsT) {
    return new Clipboard({
      ctr: this,
      shareMovesToList: Handlers.handleShareMovesToList(
        this,
        props.navigationStore,
        props.moveListsStore
      ),
    });
  }

  constructor(props: PropsT) {
    super();

    registerFacets(this);
    this._setCallbacks(props);
    this._applyPolicies(props);
    this.clipboard = this._createClipboard(props);
    makeCtrObservable(this);
  }
}
