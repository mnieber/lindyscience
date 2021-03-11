import {
  Addition,
  Addition_add,
  Addition_cancel,
  Addition_confirm,
} from 'facility-mobx/facets/Addition';
import { ClickToSelectItems } from 'src/moves/handlers/ClickToSelectItems';
import { Clipboard } from 'src/moves/MovesCtr/facets/Clipboard';
import {
  DragAndDrop,
  initDragAndDrop,
  DragAndDrop_drop,
} from 'facility-mobx/facets/DragAndDrop';
import { Editing, initEditing } from 'facility-mobx/facets/Editing';
import { EditingPrivateData } from 'src/moves/MovesCtr/facets/EditingPrivateData';
import { setCallbacks } from 'aspiration';
import { facet, installPolicies, registerFacets } from 'facility';
import { makeCtrObservable } from 'facility-mobx';
import {
  Filtering,
  initFiltering,
  Filtering_apply,
} from 'facility-mobx/facets/Filtering';
import { getIds } from 'src/app/utils';
import {
  Highlight,
  Highlight_highlightItem,
} from 'facility-mobx/facets/Highlight';
import { Inputs, initInputs } from 'src/moves/MovesCtr/facets/Inputs';
import {
  Insertion,
  initInsertion,
  Insertion_insertItems,
} from 'facility-mobx/facets/Insertion';
import { mapData } from 'facility-mobx';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesStore } from 'src/moves/MovesStore';
import { NavigationStore } from 'src/session/NavigationStore';
import { Outputs, initOutputs } from 'src/moves/MovesCtr/facets/Outputs';
import {
  Selection,
  handleSelectItem,
  Selection_selectItem,
} from 'facility-mobx/facets/Selection';
import { SelectWithKeys } from 'src/moves/handlers/SelectWithKeys';
import { MoveT } from 'src/moves/types';
import { Editing_cancel, Editing_save } from 'facility-mobx/facets/Editing';
import * as MobXFacets from 'facility-mobx/facets';
import * as MobXPolicies from 'facility-mobx/policies';
import * as Handlers from 'src/moves/MovesCtr/handlers';

type PropsT = {
  moveListsStore: MoveListsStore;
  movesStore: MovesStore;
  navigationStore: NavigationStore;
};

export class MovesContainer {
  @facet addition: Addition<MoveT> = new Addition<MoveT>();
  @facet editing: Editing = initEditing(new Editing());
  @facet editingPrivateData: EditingPrivateData = initEditing(
    new EditingPrivateData()
  );
  @facet filtering: Filtering = initFiltering(new Filtering());
  @facet highlight: Highlight = new Highlight();
  @facet inputs: Inputs = initInputs(new Inputs());
  @facet insertion: Insertion = initInsertion(new Insertion());
  @facet outputs: Outputs = initOutputs(new Outputs());
  @facet selection: Selection = new Selection();
  @facet dragAndDrop: DragAndDrop = initDragAndDrop(new DragAndDrop());

  clipboard: Clipboard;

  handlerSelectWithKeys = new SelectWithKeys({ container: this });
  handlerClick = new ClickToSelectItems({ container: this });

  _setCallbacks(props: PropsT) {
    const ctr = this;
    const navigateToMove = props.navigationStore.navigateToMove.bind(
      props.navigationStore
    );

    setCallbacks(this.addition, {
      add: {
        enter(this: Addition_add<MoveT>) {
          props.navigationStore.storeLocation();
          MobXPolicies.filteringIsDisabledOnNewItem(ctr.addition);
        },
        createItem(this: Addition_add<MoveT>) {
          MobXPolicies.newItemsAreAddedBelowTheHighlight(ctr.addition);
          return Handlers.handleCreateMove(ctr.addition, this.values);
        },
        exit(this: Addition_add<MoveT>) {
          Handlers.handleHighlightNewMove(ctr.addition);
          MobXPolicies.editingSetEnabled(ctr.addition);
        },
      },
      confirm: {
        confirm(this: Addition_confirm<MoveT>) {
          MobXPolicies.newItemsAreInsertedWhenConfirmed(ctr.addition);
        },
      },
      cancel: {
        exit(this: Addition_cancel<MoveT>) {
          MobXPolicies.editingSetDisabled(ctr.addition);
          props.navigationStore.restoreLocation();
        },
      },
    });

    setCallbacks(this.dragAndDrop, {
      drop: {
        drop(this: DragAndDrop_drop) {
          MobXPolicies.selectionIsInsertedOnDragAndDrop(
            ctr.dragAndDrop,
            this.dropPosition
          );
        },
      },
    });

    setCallbacks(this.editing, {
      save: {
        saveItem(this: Editing_save) {
          Handlers.handleSaveMove(ctr.editing, props.movesStore, this.values);
          MobXPolicies.newItemsAreConfirmedOnEditingSave(
            ctr.editing,
            this.values
          );
        },
        exit(this: Editing_save) {
          Handlers.handleNavigateToSavedMove(ctr.editing, navigateToMove);
        },
      },
      cancel: {
        enter(this: Editing_cancel) {
          MobXPolicies.newItemsAreCancelledOnEditingCancel(ctr.editing);
        },
      },
    });

    setCallbacks(this.editingPrivateData, {
      save: {
        saveItem(this: Editing_save) {
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
        enter(this: Highlight_highlightItem) {
          MobXPolicies.cancelNewItemOnHighlightChange(ctr.highlight, this.id);
        },
        exit(this: Highlight_highlightItem) {
          Handlers.handleNavigateToHighlightedItem(ctr, props.navigationStore);
        },
      },
    });

    setCallbacks(this.filtering, {
      apply: {
        exit(this: Filtering_apply) {
          MobXPolicies.highlightIsCorrectedOnFilterChange(ctr.filtering);
        },
      },
    });

    setCallbacks(this.insertion, {
      insertItems: {
        insertItems(this: Insertion_insertItems, moves: MoveT[]) {
          Handlers.handleInsertMoves(
            ctr.insertion,
            props.moveListsStore,
            moves
          );
        },
      },
    });

    setCallbacks(this.selection, {
      selectItem: {
        selectItem(this: Selection_selectItem) {
          const result = handleSelectItem(
            ctr.selection,
            this.itemSelectedProps
          );
          MobXPolicies.highlightFollowsSelection(
            ctr.selection,
            this.itemSelectedProps
          );
          return result;
        },
      },
    });
  }

  _applyPolicies(props: PropsT) {
    const inputItems = [Inputs, 'moves'];
    const itemById = [Outputs, 'moveById'];
    const preview = [Outputs, 'preview'];

    const policies = [
      // selection
      MobXFacets.selectionActsOnItems(itemById),

      // highlight
      MobXFacets.highlightActsOnItems(itemById),

      // insertion
      MobXFacets.insertionActsOnItems(inputItems),
      MobXPolicies.createInsertionPreview(
        [MobXPolicies.DragSourceFromNewItem],
        [Outputs, 'preview']
      ),

      // filtering
      MobXFacets.filteringActsOnItems(preview),

      // display
      mapData([Filtering, 'filteredItems'], [Outputs, 'display']),
      mapData([Outputs, 'display'], [Selection, 'selectableIds'], getIds),
    ];

    installPolicies<MovesContainer>(policies, this);
  }

  constructor(props: PropsT) {
    registerFacets(this);
    this._setCallbacks(props);
    this._applyPolicies(props);

    this.clipboard = new Clipboard({
      ctr: this,
      shareMovesToList: Handlers.handleShareMovesToList(
        this,
        props.navigationStore,
        props.moveListsStore
      ),
    });

    makeCtrObservable(this);
  }
}
