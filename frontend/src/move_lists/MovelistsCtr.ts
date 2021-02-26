import { Profiling } from 'src/session/facets/Profiling';
import { Inputs, initInputs } from 'src/move_lists/facets/Inputs';
import { Outputs, initOutputs } from 'src/move_lists/facets/Outputs';
import { Navigation } from 'src/session/facets/Navigation';
import { getIds } from 'src/app/utils';
import { facet, installPolicies, registerFacets } from 'facility';
import { setCallbacks } from 'aspiration';
import { ClassMemberT } from 'facility';
import {
  Labelling,
  initLabelling,
  Labelling_setLabel,
} from 'facility-mobx/facets/Labelling';
import {
  Addition,
  initAddition,
  Addition_add,
  Addition_cancel,
  Addition_confirm,
} from 'facility-mobx/facets/Addition';
import {
  Editing,
  initEditing,
  Editing_cancel,
  Editing_save,
} from 'facility-mobx/facets/Editing';
import {
  Highlight,
  initHighlight,
  Highlight_highlightItem,
} from 'facility-mobx/facets/Highlight';
import { Insertion, initInsertion } from 'facility-mobx/facets/Insertion';
import {
  Selection,
  handleSelectItem,
  initSelection,
  Selection_selectItem,
} from 'facility-mobx/facets/Selection';
import { MoveListsStore } from 'src/move_lists/MoveListsStore';
import { MoveListT } from 'src/move_lists/types';
import { mapData } from 'facility-mobx';
import * as MobXFacets from 'facility-mobx/facets';
import * as MobXPolicies from 'facility-mobx/policies';
import * as MoveListsCtrPolicies from 'src/move_lists/policies';
import * as Handlers from 'src/move_lists/handlers';
import * as SessionCtrPolicies from 'src/session/policies';

type PropsT = {
  navigation: Navigation;
  profiling: Profiling;
  moveListsStore: MoveListsStore;
};

export class MoveListsContainer {
  @facet addition: Addition<MoveListT> = initAddition(
    new Addition<MoveListT>()
  );
  @facet editing: Editing = initEditing(new Editing());
  @facet highlight: Highlight = initHighlight(new Highlight());
  @facet insertion: Insertion = initInsertion(new Insertion());
  @facet inputs: Inputs = initInputs(new Inputs());
  @facet outputs: Outputs = initOutputs(new Outputs());
  @facet selection: Selection = initSelection(new Selection());
  @facet labelling: Labelling = initLabelling(new Labelling());

  _setCallbacks(props: PropsT) {
    const ctr = this;

    setCallbacks(this.addition, {
      add: {
        enter(this: Addition_add<MoveListT>) {
          props.navigation.storeLocation();
        },
        createItem(this: Addition_add<MoveListT>) {
          MobXPolicies.newItemsAreAddedBelowTheHighlight(ctr.addition);
          Handlers.handleCreateMoveList(ctr);
        },
        exit(this: Addition_add<MoveListT>) {
          MobXPolicies.editingSetEnabled();
        },
      },
      confirm: {
        confirm(this: Addition_confirm<MoveListT>) {
          MoveListsCtrPolicies.newItemsAreFollowedWhenConfirmed(ctr.addition);
        },
      },
      cancel: {
        exit(this: Addition_cancel<MoveListT>) {
          MobXPolicies.editingSetDisabled();
          props.navigation.restoreLocation();
        },
      },
    });

    setCallbacks(this.editing, {
      save: {
        saveItem(this: Editing_save) {
          Handlers.handleSaveMoveList(props.moveListsStore);
          MobXPolicies.newItemsAreConfirmedOnEditingSave(
            ctr.editing,
            this.values
          );
        },
      },
      cancel: {
        enter(this: Editing_cancel) {
          MobXPolicies.newItemsAreCancelledOnEditingCancel(ctr.editing);
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

    setCallbacks(this.labelling, {
      setLabel: {
        saveIds(this: Labelling_setLabel) {
          Handlers.handleSaveLabels(ctr.labelling, props.profiling);
        },
      },
    });

    setCallbacks(this.selection, {
      selectItem: {
        selectItem(this: Selection_selectItem) {
          handleSelectItem(ctr.selection, this.itemSelectedProps);
          MobXPolicies.highlightFollowsSelection(
            ctr.selection,
            this.itemSelectedProps
          );
        },
      },
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
    this._setCallbacks(props);
    this._applyPolicies(props);
  }
}
