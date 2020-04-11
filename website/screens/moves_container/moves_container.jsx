// @flow

import { Navigation } from "screens/session_container/facets/navigation";
import type { UUID } from "kernel/types";
import { Outputs, initOutputs } from "screens/moves_container/facets/outputs";
import {
  type GetFacet,
  facet,
  facetClass,
  registerFacets,
  installPolicies,
} from "facet";
import { mapData } from "facet-mobx";
import { Clipboard } from "screens/moves_container/facets/clipboard";
import { getIds } from "app/utils";
import { Inputs, initInputs } from "screens/moves_container/facets/inputs";
import type { MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import { Addition, initAddition } from "facet-mobx/facets/addition";
import { Dragging, initDragging } from "facet-mobx/facets/dragging";
import { Editing, initEditing } from "facet-mobx/facets/editing";
import { Filtering, initFiltering } from "facet-mobx/facets/filtering";
import { Highlight, initHighlight } from "facet-mobx/facets/highlight";
import { Insertion, initInsertion } from "facet-mobx/facets/insertion";
import { Selection, initSelection } from "facet-mobx/facets/selection";
import { SelectWithKeys } from "screens/facet/handlers/select_with_keys";
import { ClickToSelectItems } from "screens/facet/handlers/click_to_select_items";
import { DragItems } from "screens/facet/handlers/drag_items";
import type { UserProfileT } from "profiles/types";
import * as MobXFacets from "facet-mobx/facets";
import * as MoveContainerPolicies from "screens/move_container/policies";
import * as MobXPolicies from "facet-mobx/policies";
import * as SessionContainerPolicies from "screens/session_container/policies";

export type MovesContainerPropsT = {
  isEqual: (lhs: any, rhs: any) => boolean,
  createNewMove: (userProfile: UserProfileT, sourceMoveListId: UUID) => MoveT,
  setMoves: (MoveListT, Array<MoveT>) => any,
  saveMove: (MoveT, values: any) => any,
  shareMovesToList: (Array<MoveT>, MoveListT, ?MoveListT) => any,
  navigation: Navigation,
};

// $FlowFixMe
@facetClass
export class MovesContainer {
  @facet(Addition) addition: Addition;
  @facet(Dragging) dragging: Dragging;
  @facet(Editing) editing: Editing;
  @facet(Filtering) filtering: Filtering;
  @facet(Highlight) highlight: Highlight;
  @facet(Insertion) insertion: Insertion;
  @facet(Inputs) inputs: Inputs;
  @facet(Outputs) outputs: Outputs;
  @facet(Selection) selection: Selection;

  clipboard: Clipboard;

  handlerSelectWithKeys = new SelectWithKeys({ container: this });
  handlerClick = new ClickToSelectItems({ container: this });
  handlerDrag = new DragItems({ container: this });

  _createFacets(props: MovesContainerPropsT) {
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
      insertItems: preview => {
        props.setMoves((this.inputs.moveList: any), preview);
      },
    });
    this.inputs = initInputs(new Inputs());
    this.outputs = initOutputs(new Outputs());
    this.selection = initSelection(new Selection());

    registerFacets(this);
  }

  _applyPolicies(props: MovesContainerPropsT) {
    const inputItems = [Inputs, "moves"];
    const itemById = [Outputs, "moveById"];
    const preview = [Outputs, "preview"];

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
      mapData([Filtering, "filteredItems"], [Outputs, "display"]),
      mapData([Outputs, "display"], [Selection, "selectableIds"], getIds),
    ];

    installPolicies(policies, this);
  }

  constructor(props: MovesContainerPropsT) {
    this._createFacets(props);
    this._applyPolicies(props);
    this.clipboard = new Clipboard({
      ctr: this,
      shareMovesToList: props.shareMovesToList,
    });
  }

  static get: GetFacet<MovesContainer>;
}
