// @flow

import { values } from 'rambda';

import { facet, installPolicies, registerFacets } from 'src/facet';
import { Navigation } from 'src/screens/session_container/facets/navigation';
import type { UUID } from 'src/kernel/types';
import {
  Outputs,
  initOutputs,
} from 'src/screens/moves_container/facets/outputs';
import { mapData } from 'src/facet-mobx';
import { Clipboard } from 'src/screens/moves_container/facets/clipboard';
import { getIds } from 'src/app/utils';
import { Inputs, initInputs } from 'src/screens/moves_container/facets/inputs';
import type { MoveListT } from 'src/move_lists/types';
import type { MoveT } from 'src/moves/types';
import { Addition, initAddition } from 'src/facet-mobx/facets/addition';
import { Dragging, initDragging } from 'src/facet-mobx/facets/dragging';
import { Editing, initEditing } from 'src/facet-mobx/facets/editing';
import { Filtering, initFiltering } from 'src/facet-mobx/facets/filtering';
import { Highlight, initHighlight } from 'src/facet-mobx/facets/highlight';
import { Insertion, initInsertion } from 'src/facet-mobx/facets/insertion';
import { Selection, initSelection } from 'src/facet-mobx/facets/selection';
import { SelectWithKeys } from 'src/screens/facet/handlers/select_with_keys';
import { ClickToSelectItems } from 'src/screens/facet/handlers/click_to_select_items';
import { DragItems } from 'src/screens/facet/handlers/drag_items';
import type { UserProfileT } from 'src/profiles/types';
import * as MobXFacets from 'src/facet-mobx/facets';
import * as MoveContainerPolicies from 'src/screens/move_container/policies';
import * as MobXPolicies from 'src/facet-mobx/policies';
import * as SessionContainerPolicies from 'src/screens/session_container/policies';

type PropsT = {
  isEqual: (lhs: any, rhs: any) => boolean,
  createNewMove: (userProfile: UserProfileT, sourceMoveListId: UUID) => MoveT,
  setMoves: (MoveListT, Array<MoveT>) => any,
  saveMove: (MoveT, values: any) => any,
  shareMovesToList: (Array<MoveT>, MoveListT, ?MoveListT) => any,
  navigation: Navigation,
};

export class MovesContainer {
  @facet addition: Addition;
  @facet dragging: Dragging;
  @facet editing: Editing;
  @facet filtering: Filtering;
  @facet highlight: Highlight;
  @facet insertion: Insertion;
  @facet inputs: Inputs;
  @facet outputs: Outputs;
  @facet selection: Selection;

  clipboard: Clipboard;

  handlerSelectWithKeys = new SelectWithKeys({ container: this });
  handlerClick = new ClickToSelectItems({ container: this });
  handlerDrag = new DragItems({ container: this });

  _createFacets(props: PropsT) {
    this.addition = initAddition(new Addition(), {
      createItem: (values: any) => {
        return props.createNewMove(
          (this.inputs.userProfile: any),
          (this.inputs.moveList: any).id
        );
      },
      isEqual: props.isEqual,
    });
    this.dragging = initDragging(new Dragging());
    this.editing = initEditing(new Editing(), {
      saveItem: (values: any) => {
        props.saveMove(this.highlight.item, values);
      },
    });
    this.filtering = initFiltering(new Filtering());
    this.highlight = initHighlight(new Highlight());
    this.insertion = initInsertion(new Insertion(), {
      insertItems: (preview) => {
        props.setMoves((this.inputs.moveList: any), preview);
      },
    });
    this.inputs = initInputs(new Inputs());
    this.outputs = initOutputs(new Outputs());
    this.selection = initSelection(new Selection());

    registerFacets(this);
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
      MobXPolicies.highlightFollowsSelection,
      MobXPolicies.highlightIsCorrectedOnFilterChange,

      // navigation
      MobXPolicies.locationIsStoredOnNewItem(props.navigation.storeLocation),
      MobXPolicies.locationIsRestoredOnCancelNewItem(
        props.navigation.restoreLocation
      ),
      MoveContainerPolicies.handleNavigateToMove(props.navigation),
      SessionContainerPolicies.syncUrlWithNewMove(props.navigation),
      SessionContainerPolicies.syncMoveWithCurrentUrl(props.navigation),

      // insertion
      MobXFacets.insertionActsOnItems(inputItems),
      MobXFacets.insertionCreatesThePreview({ preview }),
      MobXPolicies.insertionHappensOnDrop,
      MobXPolicies.insertionPicksAPayloadsSource({
        payloadSources: [
          MobXPolicies.insertByCreatingAnItem({ showPreview: true }),
          MobXPolicies.insertByDraggingSelection({ showPreview: false }),
        ],
      }),

      // creation
      MobXPolicies.newItemsAreCreatedBelowTheHighlight,
      MobXPolicies.newItemsAreEdited,
      MobXPolicies.newItemsAreInsertedWhenConfirmed,
      MobXPolicies.newItemsAreConfirmedWhenSaved,
      MobXPolicies.newItemsAreCanceledOnHighlightChange,

      // filtering
      MobXFacets.filteringActsOnItems(preview),
      MobXPolicies.filteringIsDisabledOnNewItem,

      // display
      mapData([Filtering, 'filteredItems'], [Outputs, 'display']),
      mapData([Outputs, 'display'], [Selection, 'selectableIds'], getIds),
    ];

    installPolicies(policies, this);
  }

  constructor(props: PropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
    this.clipboard = new Clipboard({
      ctr: this,
      shareMovesToList: props.shareMovesToList,
    });
  }
}
