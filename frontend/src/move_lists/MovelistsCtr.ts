import { Profiling } from 'src/session/facets/Profiling';
import { Inputs, initInputs } from 'src/move_lists/facets/Inputs';
import { Outputs, initOutputs } from 'src/move_lists/facets/Outputs';
import { Navigation } from 'src/session/facets/Navigation';
import { getIds } from 'src/app/utils';
import { facet, installPolicies, registerFacets } from 'facet';
import { ClassMemberT } from 'facet/types';
import { mapData } from 'facet-mobx';
import { Labelling, initLabelling } from 'facet-mobx/facets/labelling';
import { Addition, initAddition } from 'facet-mobx/facets/addition';
import { Editing, initEditing } from 'facet-mobx/facets/editing';
import { Highlight, initHighlight } from 'facet-mobx/facets/highlight';
import { DragAndDrop, initDragAndDrop } from 'facet-mobx/facets/DragAndDrop';
import { Selection, initSelection } from 'facet-mobx/facets/selection';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';

import * as MobXFacets from 'facet-mobx/facets';
import * as MobXPolicies from 'facet-mobx/policies';
import * as MoveListsCtrPolicies from 'src/move_lists/policies';
import * as MoveListsCtrHandlers from 'src/move_lists/handlers';
import * as SessionCtrPolicies from 'src/session/policies';

const compareById = (lhs: any, rhs: any) => lhs.id === rhs.id;

type PropsT = {
  navigation: Navigation;
  profiling: Profiling;
  moveListsStore: MoveListsStore;
};

export class MoveListsContainer {
  @facet addition: Addition;
  @facet editing: Editing;
  @facet highlight: Highlight;
  @facet dragAndDrop: DragAndDrop;
  @facet inputs: Inputs;
  @facet outputs: Outputs;
  @facet selection: Selection;
  @facet labelling: Labelling;

  _applyPolicies(props: PropsT) {
    const inputItems = [Inputs, 'moveLists'];
    const itemById = [Outputs, 'moveListById'];
    const preview = [Outputs, 'preview'];
    const moveListsFollowing: ClassMemberT = [Inputs, 'moveListsFollowing'];

    const policies = [
      // selection
      MobXFacets.selectionActsOnItems(itemById),
      SessionCtrPolicies.selectTheMoveListThatMatchesTheUrl(props.navigation),

      // highlight
      MobXFacets.highlightActsOnItems(itemById),
      MobXPolicies.highlightFollowsSelection,

      // navigation
      MobXPolicies.locationIsRestoredOnCancelNewItem(
        props.navigation.storeLocation,
        props.navigation.restoreLocation
      ),

      // dragAndDrop
      MobXFacets.dragAndDropActsOnItems(inputItems),
      MobXFacets.draggingCreatesThePreview({ preview }),
      MobXPolicies.useDragSources([
        new MobXPolicies.DragSourceFromNewItem({
          showPreview: true,
          performDropOnConfirmNewItem: true,
        }),
      ]),

      // creation
      MobXPolicies.newItemsAreCreatedBelowTheHighlight({
        cancelOnHighlightChange: true,
      }),
      MobXPolicies.newItemsAreEdited,
      MobXPolicies.newItemsAreConfirmedWhenSaved(compareById),
      MoveListsCtrPolicies.newItemsAreFollowedWhenConfirmed,

      // labelling
      MobXFacets.labellingReceivesIds(moveListsFollowing, 'following', getIds),

      // display
      mapData([Outputs, 'preview'], [Outputs, 'display']),
      mapData([Outputs, 'display'], [Selection, 'selectableIds'], getIds),
    ];

    installPolicies<MoveListsContainer>(policies, this);
  }

  constructor(props: PropsT) {
    this.addition = initAddition(new Addition(), {
      createItem: MoveListsCtrHandlers.handleCreateMoveList(this),
    });
    this.editing = initEditing(new Editing(), {
      saveItem: MoveListsCtrHandlers.handleSaveMoveList(
        this,
        props.moveListsStore
      ),
    });
    this.highlight = initHighlight(new Highlight());
    this.dragAndDrop = initDragAndDrop(new DragAndDrop());
    this.inputs = initInputs(new Inputs());
    this.outputs = initOutputs(new Outputs());
    this.selection = initSelection(new Selection());
    this.labelling = initLabelling(new Labelling(), {
      saveIds: MoveListsCtrHandlers.handleSaveLabels(this, props.profiling),
    });

    registerFacets(this);
    this._applyPolicies(props);
  }
}
