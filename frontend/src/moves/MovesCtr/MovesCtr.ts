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
import { Navigation } from 'src/session/facets/Navigation';
import { Outputs, initOutputs } from 'src/moves/MovesCtr/facets/Outputs';
import {
  Selection,
  handleSelectItem,
  Selection_selectItem,
} from 'facility-mobx/facets/Selection';
import { SelectWithKeys } from 'src/moves/handlers/SelectWithKeys';
import { MoveT } from 'src/moves/types';
import {
  Editing_cancel,
  Editing_save,
  Editing_enable,
} from 'facility-mobx/facets/Editing';
import * as MobXFacets from 'facility-mobx/facets';
import * as MobXPolicies from 'facility-mobx/policies';
import * as SessionCtrPolicies from 'src/session/policies';
import * as Handlers from 'src/moves/MovesCtr/handlers';

type PropsT = {
  moveListsStore: MoveListsStore;
  movesStore: MovesStore;
  navigation: Navigation;
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
    const navigateToMove = props.navigation.navigateToMove.bind(
      props.navigation
    );

    setCallbacks(this.addition, {
      add: {
        enter(this: Addition_add<MoveT>) {
          props.navigation.storeLocation();
          MobXPolicies.filteringIsDisabledOnNewItem(ctr.addition);
        },
        createItem(this: Addition_add<MoveT>) {
          MobXPolicies.newItemsAreAddedBelowTheHighlight(ctr.addition);
          return Handlers.handleCreateMove(ctr.addition, this.values);
        },
        exit(this: Addition_add<MoveT>) {
          Handlers.handleNavigateToNewMove(ctr.addition, navigateToMove);
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
          props.navigation.restoreLocation();
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
          Handlers.handleNavigateToSavedMove(ctr.editing, navigateToMove);
        },
      },
      cancel: {
        enter(this: Editing_cancel) {
          MobXPolicies.newItemsAreCancelledOnEditingCancel(ctr.editing);
        },
      },
      enable: {
        enter(this: Editing_enable) {},
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

      // navigation
      SessionCtrPolicies.syncMoveWithCurrentUrl(props.navigation),

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
        props.navigation,
        props.moveListsStore
      ),
    });

    makeCtrObservable(this);
  }
}
