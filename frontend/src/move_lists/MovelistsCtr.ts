import { Profiling } from 'src/session/facets/Profiling';
import { Inputs, initInputs } from 'src/move_lists/facets/Inputs';
import { Outputs, initOutputs } from 'src/move_lists/facets/Outputs';
import { Navigation } from 'src/session/facets/Navigation';
import { getIds } from 'src/app/utils';
import {
  lbl,
  installActions,
  facet,
  installPolicies,
  registerFacets,
} from 'facet';
import { ClassMemberT } from 'facet/types';
import { Labelling, initLabelling } from 'facet-mobx/facets/Labelling';
import { Addition } from 'facet-mobx/facets/Addition';
import { Editing, initEditing } from 'facet-mobx/facets/Editing';
import { Highlight } from 'facet-mobx/facets/Highlight';
import { Insertion, initInsertion } from 'facet-mobx/facets/Insertion';
import { Selection, handleSelectItem } from 'facet-mobx/facets/Selection';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MoveListT } from 'src/move_lists/types';

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
  @facet addition: Addition<MoveListT> = new Addition<MoveListT>();
  @facet editing: Editing = initEditing(new Editing());
  @facet highlight: Highlight = new Highlight();
  @facet insertion: Insertion = initInsertion(new Insertion());
  @facet inputs: Inputs = initInputs(new Inputs());
  @facet outputs: Outputs = initOutputs(new Outputs());
  @facet selection: Selection = new Selection();
  @facet labelling: Labelling = initLabelling(new Labelling());

  _installActions(props: PropsT) {
    installActions(this.addition, {
      add: [
        //
        props.navigation.storeLocation,
        MobXPolicies.newItemsAreAddedBelowTheHighlight,
        lbl('createItem', MoveListsCtrHandlers.handleCreateMoveList(this)),
        MobXPolicies.editingSetEnabled,
      ],
      confirm: [
        lbl('confirm', MoveListsCtrPolicies.newItemsAreFollowedWhenConfirmed),
      ],
      cancel: [
        //
        MobXPolicies.editingSetDisabled,
        props.navigation.restoreLocation,
      ],
    });

    installActions(this.editing, {
      save: [
        //
        lbl(
          'saveItem',
          MoveListsCtrHandlers.handleSaveMoveList(props.moveListsStore)
        ),
        MobXPolicies.newItemsAreConfirmedOnEditingSave,
      ],
      cancel: [
        //
        MobXPolicies.newItemsAreCancelledOnEditingCancel,
      ],
    });

    installActions(this.highlight, {
      highlightItem: [
        //
        MobXPolicies.cancelNewItemOnHighlightChange,
      ],
    });

    installActions(this.labelling, {
      setLabel: [
        //
        lbl('saveIds', MoveListsCtrHandlers.handleSaveLabels(props.profiling)),
      ],
    });

    installActions(this.selection, {
      selectItem: [
        //
        lbl('selectItem', handleSelectItem),
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

      // insertion
      MobXFacets.insertionActsOnItems(inputItems),
      MobXPolicies.createInsertionPreview(
        [MobXPolicies.DragSourceFromNewItem],
        [Outputs, 'display']
      ),

      // labelling
      MobXFacets.labellingReceivesIds(moveListsFollowing, 'following', getIds),

      // display
      mapData([Outputs, 'display'], [Selection, 'selectableIds'], getIds),
    ];

    installPolicies<MoveListsContainer>(policies, this);
  }

  constructor(props: PropsT) {
    registerFacets(this);
    this._installActions(props);
    this._applyPolicies(props);
  }
}
