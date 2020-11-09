import { Addition } from 'facet-mobx/facets/Addition';
import { ClickToSelectItems } from 'src/moves/handlers/ClickToSelectItems';
import { Clipboard } from 'src/moves/MovesCtr/facets/Clipboard';
import { DragAndDrop, initDragAndDrop } from 'facet-mobx/facets/DragAndDrop';
import { Editing, initEditing } from 'facet-mobx/facets/Editing';
import { EditingPrivateData } from 'src/moves/MovesCtr/facets/EditingPrivateData';
import { setCallbacks, facet, installPolicies, registerFacets } from 'facet';
import { Filtering, initFiltering } from 'facet-mobx/facets/Filtering';
import { getIds } from 'src/app/utils';
import { Highlight } from 'facet-mobx/facets/Highlight';
import { Inputs, initInputs } from 'src/moves/MovesCtr/facets/Inputs';
import { Insertion, initInsertion } from 'facet-mobx/facets/Insertion';
import { mapData } from 'facet-mobx';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MovesStore } from 'src/moves/MovesStore';
import { Navigation } from 'src/session/facets/Navigation';
import { Outputs, initOutputs } from 'src/moves/MovesCtr/facets/Outputs';
import { Selection, handleSelectItem } from 'facet-mobx/facets/Selection';
import { SelectWithKeys } from 'src/moves/handlers/SelectWithKeys';
import { MoveT } from 'src/moves/types';
import * as MobXFacets from 'facet-mobx/facets';
import * as MobXPolicies from 'facet-mobx/policies';
import * as SessionCtrPolicies from 'src/session/policies';
import * as MovesCtrHandlers from 'src/moves/MovesCtr/handlers';

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
    const navigateToMove = props.navigation.navigateToMove;

    setCallbacks(this.addition, {
      add: {
        enter: [
          props.navigation.storeLocation,
          MobXPolicies.filteringIsDisabledOnNewItem,
        ],
        createItem: [
          MobXPolicies.newItemsAreAddedBelowTheHighlight,
          MovesCtrHandlers.handleCreateMove,
        ],
        exit: [
          MovesCtrHandlers.handleNavigateToNewMove(navigateToMove),
          MobXPolicies.editingSetEnabled,
        ],
      },
      confirm: {
        confirm: [MobXPolicies.newItemsAreInsertedWhenConfirmed],
      },
      cancel: {
        enter: [MobXPolicies.editingSetDisabled],
        exit: [props.navigation.restoreLocation],
      },
    });

    setCallbacks(this.dragAndDrop, {
      drop: {
        drop: [MobXPolicies.selectionIsInsertedOnDragAndDrop],
      },
    });

    setCallbacks(this.editing, {
      save: {
        saveItem: [
          MovesCtrHandlers.handleSaveMove(props.movesStore),
          MobXPolicies.newItemsAreConfirmedOnEditingSave,
          MovesCtrHandlers.handleNavigateToSavedMove(navigateToMove),
        ],
      },
      cancel: {
        enter: [MobXPolicies.newItemsAreCancelledOnEditingCancel],
      },
    });

    setCallbacks(this.editingPrivateData, {
      save: {
        saveItem: [MovesCtrHandlers.handleSavePrivateData(props.movesStore)],
      },
    });

    setCallbacks(this.highlight, {
      highlightItem: {
        enter: [MobXPolicies.cancelNewItemOnHighlightChange],
      },
    });

    setCallbacks(this.filtering, {
      apply: {
        exit: [MobXPolicies.highlightIsCorrectedOnFilterChange],
      },
    });

    setCallbacks(this.insertion, {
      insertItems: {
        insertItems: [MovesCtrHandlers.handleInsertMoves(props.moveListsStore)],
      },
    });

    setCallbacks(this.selection, {
      selectItem: {
        selectItem: [handleSelectItem, MobXPolicies.highlightFollowsSelection],
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
      shareMovesToList: MovesCtrHandlers.handleShareMovesToList(
        this,
        props.navigation,
        props.moveListsStore
      ),
    });
  }
}
