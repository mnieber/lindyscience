import { Profiling } from 'src/session/facets/Profiling';
import { Inputs, initInputs } from 'src/move_lists/facets/Inputs';
import { Outputs, initOutputs } from 'src/move_lists/facets/Outputs';
import { Navigation } from 'src/session/facets/Navigation';
import { getIds } from 'src/app/utils';
import { facet, installPolicies, registerFacets } from 'facet';
import { ClassMemberT } from 'facet/types';
import { mapData } from 'facet-mobx';
import { Labelling, initLabelling } from 'facet-mobx/facets/Labelling';
import { Addition, initAddition } from 'facet-mobx/facets/Addition';
import { Editing, initEditing } from 'facet-mobx/facets/Editing';
import { Highlight, initHighlight } from 'facet-mobx/facets/Highlight';
import { Insertion, initInsertion } from 'facet-mobx/facets/Insertion';
import { Selection, initSelection } from 'facet-mobx/facets/Selection';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';

import * as MobXFacets from 'facet-mobx/facets';
import * as MobXPolicies from 'facet-mobx/policies';
import * as MoveListsCtrPolicies from 'src/move_lists/policies';
import * as MoveListsCtrHandlers from 'src/move_lists/handlers';
import * as SessionCtrPolicies from 'src/session/policies';

type PropsT = {
  navigation: Navigation;
  profiling: Profiling;
  moveListsStore: MoveListsStore;
};

export class MoveListsContainer {
  @facet addition: Addition;
  @facet editing: Editing;
  @facet highlight: Highlight;
  @facet insertion: Insertion;
  @facet inputs: Inputs;
  @facet outputs: Outputs;
  @facet selection: Selection;
  @facet labelling: Labelling;

  _applyPolicies(props: PropsT) {
    const inputItems = [Inputs, 'moveLists'];
    const itemById = [Outputs, 'moveListById'];
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

      // insertion
      MobXFacets.insertionActsOnItems(inputItems),
      MobXPolicies.insertionPreviewUsesDragSources([
        MobXPolicies.DragSourceFromNewItem,
      ]),

      // creation
      MobXPolicies.newItemsAreAddedBelowTheHighlight,
      MobXPolicies.cancelNewItemOnHighlightChange,
      MobXPolicies.newItemsAreSelectedAndEdited,
      MobXPolicies.newItemsAreConfirmedWhenSaved,
      MobXPolicies.newItemsAreInsertedWhenConfirmed,
      MoveListsCtrPolicies.newItemsAreFollowedWhenConfirmed,

      // labelling
      MobXFacets.labellingReceivesIds(moveListsFollowing, 'following', getIds),

      // display
      mapData([Insertion, 'preview'], [Outputs, 'display']),
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
    this.insertion = initInsertion(new Insertion(), {
      insertItems: () => {},
    });
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
