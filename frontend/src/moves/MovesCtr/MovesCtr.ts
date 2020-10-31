import { Addition, handleResetNewItem } from 'facet-mobx/facets/Addition';
import { ClickToSelectItems } from 'src/moves/handlers/ClickToSelectItems';
import { Clipboard } from 'src/moves/MovesCtr/facets/Clipboard';
import { DragAndDrop, initDragAndDrop } from 'facet-mobx/facets/DragAndDrop';
import { Editing, initEditing } from 'facet-mobx/facets/Editing';
import {
  lbl,
  installActions,
  facet,
  installPolicies,
  registerFacets,
} from 'facet';
import { Filtering, initFiltering } from 'facet-mobx/facets/Filtering';
import { getIds } from 'src/app/utils';
import { Highlight, handleHighlightItem } from 'facet-mobx/facets/Highlight';
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
import * as MovesCtrPolicies from 'src/moves/MovesCtr/policies';
import * as MovesCtrHandlers from 'src/moves/MovesCtr/handlers';

type PropsT = {
  moveListsStore: MoveListsStore;
  movesStore: MovesStore;
  navigation: Navigation;
};

export class MovesContainer {
  @facet addition: Addition<MoveT> = new Addition<MoveT>();
  @facet editing: Editing;
  @facet filtering: Filtering;
  @facet highlight: Highlight = new Highlight();
  @facet inputs: Inputs;
  @facet insertion: Insertion;
  @facet outputs: Outputs;
  @facet selection: Selection = new Selection();
  @facet dragAndDrop: DragAndDrop;

  clipboard: Clipboard;

  handlerSelectWithKeys = new SelectWithKeys({ container: this });
  handlerClick = new ClickToSelectItems({ container: this });

  _installActions(props: PropsT) {
    installActions(this.highlight, {
      highlightItem: [
        //
        lbl('highlightItem', handleHighlightItem),
        MobXPolicies.cancelNewItemOnHighlightChange,
      ],
    });

    installActions(this.selection, {
      selectItem: [
        //
        lbl('selectItem', handleSelectItem),
        MobXPolicies.highlightFollowsSelection,
      ],
    });

    installActions(this.addition, {
      add: [
        //
        MobXPolicies.newItemsAreAddedBelowTheHighlight,
        lbl('createItem', MovesCtrHandlers.handleCreateMove(this)),
        MobXPolicies.editingSetEnabled,
      ],
      confirm: [
        //
        lbl('confirm', MobXPolicies.newItemsAreInsertedWhenConfirmed),
        lbl('reset', handleResetNewItem),
      ],
      cancel: [
        //
        MobXPolicies.editingSetDisabled,
        lbl('reset', handleResetNewItem),
      ],
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
      MobXPolicies.highlightIsCorrectedOnFilterChange,

      // navigation
      MobXPolicies.locationIsRestoredOnCancelNewItem(
        props.navigation.storeLocation,
        props.navigation.restoreLocation
      ),
      MovesCtrPolicies.handleNavigateToMove(props.navigation),
      SessionCtrPolicies.syncUrlWithNewMove(props.navigation),
      SessionCtrPolicies.syncMoveWithCurrentUrl(props.navigation),

      // insertion
      MobXFacets.insertionActsOnItems(inputItems),
      MobXPolicies.createInsertionPreview(
        [MobXPolicies.DragSourceFromNewItem],
        [Outputs, 'preview']
      ),
      MobXPolicies.selectionIsInsertedOnDragAndDrop,

      // creation
      MobXPolicies.newItemsAreConfirmedWhenSaved,

      // filtering
      MobXFacets.filteringActsOnItems(preview),
      MobXPolicies.filteringIsDisabledOnNewItem,

      // display
      mapData([Filtering, 'filteredItems'], [Outputs, 'display']),
      mapData([Outputs, 'display'], [Selection, 'selectableIds'], getIds),
    ];

    installPolicies<MovesContainer>(policies, this);
  }

  constructor(props: PropsT) {
    this.insertion = initInsertion(new Insertion(), {
      insertItems: MovesCtrHandlers.handleInsertMoves(
        this,
        props.moveListsStore
      ),
    });
    this.editing = initEditing(new Editing(), {
      saveItem: MovesCtrHandlers.handleSaveMove(
        this,
        props.navigation,
        props.movesStore
      ),
    });
    this.filtering = initFiltering(new Filtering());
    this.inputs = initInputs(new Inputs());
    this.outputs = initOutputs(new Outputs());
    this.dragAndDrop = initDragAndDrop(new DragAndDrop());

    registerFacets(this);
    this._installActions(props);
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
