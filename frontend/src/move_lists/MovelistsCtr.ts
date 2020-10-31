import { Profiling } from 'src/session/facets/Profiling';
import { Inputs, initInputs } from 'src/move_lists/facets/Inputs';
import { Outputs, initOutputs } from 'src/move_lists/facets/Outputs';
import { Navigation } from 'src/session/facets/Navigation';
import { getIds } from 'src/app/utils';
import { installActions, facet, installPolicies, registerFacets } from 'facet';
import { ClassMemberT } from 'facet/types';
import { Labelling, initLabelling } from 'facet-mobx/facets/Labelling';
import { Addition, initAddition } from 'facet-mobx/facets/Addition';
import { Editing, initEditing } from 'facet-mobx/facets/Editing';
import { Highlight, handleHighlightItem } from 'facet-mobx/facets/Highlight';
import { Insertion, initInsertion } from 'facet-mobx/facets/Insertion';
import { Selection, handleSelectItem } from 'facet-mobx/facets/Selection';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';

import { mapData } from 'facet-mobx';
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
  @facet highlight: Highlight = new Highlight();
  @facet insertion: Insertion;
  @facet inputs: Inputs;
  @facet outputs: Outputs;
  @facet selection: Selection = new Selection();
  @facet labelling: Labelling;

  _installActions(props: PropsT) {
    installActions(this.highlight, {
      highlightItem: [
        //
        handleHighlightItem,
        MobXPolicies.cancelNewItemOnHighlightChange(this),
      ],
    });

    installActions(this.selection, {
      selectItem: [
        //
        handleSelectItem,
        MobXPolicies.highlightFollowsSelection,
      ],
    });
  }

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

      // navigation
      MobXPolicies.locationIsRestoredOnCancelNewItem(
        props.navigation.storeLocation,
        props.navigation.restoreLocation
      ),

      // insertion
      MobXFacets.insertionActsOnItems(inputItems),
      MobXPolicies.createInsertionPreview(
        [MobXPolicies.DragSourceFromNewItem],
        [Outputs, 'display']
      ),

      // creation
      MobXPolicies.newItemsAreAddedBelowTheHighlight,
      MobXPolicies.newItemsAreEdited,
      MobXPolicies.newItemsAreConfirmedWhenSaved,
      MobXPolicies.newItemsAreInsertedWhenConfirmed,
      MoveListsCtrPolicies.newItemsAreFollowedWhenConfirmed,

      // labelling
      MobXFacets.labellingReceivesIds(moveListsFollowing, 'following', getIds),

      // display
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
    this.insertion = initInsertion(new Insertion(), {
      insertItems: () => {},
    });
    this.inputs = initInputs(new Inputs());
    this.outputs = initOutputs(new Outputs());
    this.labelling = initLabelling(new Labelling(), {
      saveIds: MoveListsCtrHandlers.handleSaveLabels(this, props.profiling),
    });

    registerFacets(this);
    this._applyPolicies(props);
  }
}
