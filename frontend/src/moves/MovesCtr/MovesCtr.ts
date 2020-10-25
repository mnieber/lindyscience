import { MovesStore } from 'src/moves/MovesStore';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { Inputs, initInputs } from 'src/moves/MovesCtr/facets/Inputs';
import { Outputs, initOutputs } from 'src/moves/MovesCtr/facets/Outputs';
import { Navigation } from 'src/session/facets/Navigation';
import { Clipboard } from 'src/moves/MovesCtr/facets/Clipboard';
import { SelectWithKeys } from 'src/moves/handlers/SelectWithKeys';
import { ClickToSelectItems } from 'src/moves/handlers/ClickToSelectItems';
import { DragItems } from 'src/moves/handlers/DragItems';
import { getIds } from 'src/app/utils';
import { facet, installPolicies, registerFacets } from 'facet';
import { mapData } from 'facet-mobx';
import { Addition, initAddition } from 'facet-mobx/facets/Addition';
import { Editing, initEditing } from 'facet-mobx/facets/Editing';
import { Filtering, initFiltering } from 'facet-mobx/facets/Filtering';
import { Highlight, initHighlight } from 'facet-mobx/facets/Highlight';
import { DragAndDrop, initDragAndDrop } from 'facet-mobx/facets/DragAndDrop';
import { Selection, initSelection } from 'facet-mobx/facets/Selection';
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
  @facet addition: Addition;
  @facet dragAndDrop: DragAndDrop;
  @facet editing: Editing;
  @facet filtering: Filtering;
  @facet highlight: Highlight;
  @facet inputs: Inputs;
  @facet outputs: Outputs;
  @facet selection: Selection;

  clipboard: Clipboard;

  handlerSelectWithKeys = new SelectWithKeys({ container: this });
  handlerClick = new ClickToSelectItems({ container: this });
  handlerDrag = new DragItems({ container: this });

  _applyPolicies(props: PropsT) {
    const inputItems = [Inputs, 'moves'];
    const itemById = [Outputs, 'moveById'];
    const preview = [Outputs, 'preview'];

    const policies = [
      // selection
      MobXFacets.selectionActsOnItems(itemById),

      // highlight
      MobXFacets.highlightActsOnItems(itemById),
      MobXPolicies.highlightFollowsSelection,
      MobXPolicies.highlightIsCorrectedOnFilterChange,

      // navigation
      MobXPolicies.locationIsRestoredOnCancelNewItem(
        props.navigation.storeLocation,
        props.navigation.restoreLocation
      ),
      MovesCtrPolicies.handleNavigateToMove(props.navigation),
      SessionCtrPolicies.syncUrlWithNewMove(props.navigation),
      SessionCtrPolicies.syncMoveWithCurrentUrl(props.navigation),

      // dragAndDrop
      MobXFacets.dragAndDropActsOnItems(inputItems),
      MobXFacets.draggingCreatesThePreview({ preview }),
      MovesCtrPolicies.handleSaveMoveOrderOnDrop(props.moveListsStore),
      MobXPolicies.useDragSources([
        new MobXPolicies.DragSourceFromNewItem({
          showPreview: true,
          performDropOnConfirmNewItem: true,
        }),
        new MobXPolicies.DragSourceFromSelection({ showPreview: false }),
      ]),

      // creation
      MobXPolicies.newItemsAreCreatedBelowTheHighlight,
      MobXPolicies.cancelNewItemOnHighlightChange,
      MobXPolicies.newItemsAreSelectedAndEdited,
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
    this.addition = initAddition(new Addition(), {
      createItem: MovesCtrHandlers.handleCreateMove(this),
    });
    this.dragAndDrop = initDragAndDrop(new DragAndDrop());
    this.editing = initEditing(new Editing(), {
      saveItem: MovesCtrHandlers.handleSaveMove(
        this,
        props.navigation,
        props.movesStore
      ),
    });
    this.filtering = initFiltering(new Filtering());
    this.highlight = initHighlight(new Highlight());
    this.inputs = initInputs(new Inputs());
    this.outputs = initOutputs(new Outputs());
    this.selection = initSelection(new Selection());

    registerFacets(this);
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
