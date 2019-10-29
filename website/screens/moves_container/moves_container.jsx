// @flow

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
import { Policies } from "screens/facet/policies";
import { insertByCreatingAnItem } from "facet-mobx/policies/insert_by_creating_a_new_item";
import { insertByDraggingSelection } from "facet-mobx/policies/insert_by_dragging_selection";
import { runInAction } from "utils/mobx_wrapper";

export type MovesContainerPropsT = {
  isEqual: (lhs: any, rhs: any) => boolean,
  createNewMove: (userProfile: UserProfileT, sourceMoveListId: UUID) => MoveT,
  setMoves: (MoveListT, Array<MoveT>) => any,
  saveMove: (MoveT, values: any) => any,
  shareMovesToList: (Array<MoveT>, MoveListT, ?MoveListT) => any,
  storeLocation: () => void,
  restoreLocation: () => void,
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
        return this.inputs.moveList && this.inputs.userProfile
          ? props.createNewMove(
              this.inputs.userProfile,
              this.inputs.moveList.id
            )
          : undefined;
      },
      isEqual: props.isEqual,
    });
    this.dragging = initDragging(new Dragging());
    this.editing = initEditing(new Editing(), {
      saveItem: (values: any) => {
        if (this.highlight.item) {
          props.saveMove(this.highlight.item, values);
        }
      },
    });
    this.filtering = initFiltering(new Filtering());
    this.highlight = initHighlight(new Highlight());
    this.insertion = initInsertion(new Insertion(), {
      insertItems: preview => {
        if (this.inputs.moveList) {
          props.setMoves(this.inputs.moveList, preview);
        }
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
      Policies.selection.actsOnItems(itemById),

      Policies.highlight.actsOnItems(itemById),
      Policies.highlight.followsSelection,
      Policies.highlight.isCorrectedOnFilterChange,

      Policies.navigation.locationIsStoredOnNewItem(props.storeLocation),
      Policies.navigation.locationIsRestoredOnCancelNewItem(
        props.restoreLocation
      ),

      Policies.insertion.actsOnItems(inputItems),
      Policies.insertion.createsThePreview({ preview }),
      Policies.insertion.happensOnDrop,
      Policies.insertion.picksAPayloadsSource({
        payloadSources: [
          insertByCreatingAnItem({ showPreview: true }),
          insertByDraggingSelection({ showPreview: false }),
        ],
      }),

      Policies.newItems.areCreatedBelowTheHighlight,
      Policies.newItems.areEdited,
      Policies.newItems.areInsertedWhenConfirmed,
      Policies.newItems.areConfirmedWhenSaved,
      Policies.newItems.areCanceledOnHighlightChange,

      Policies.filtering.actsOnItems(preview),
      Policies.filtering.isDisabledOnNewItem,

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

  setInputs(
    moves: Array<MoveT>,
    moveList: ?MoveListT,
    moveLists: Array<MoveListT>,
    userProfile: ?UserProfileT
  ) {
    runInAction("movesContainer.setInputs", () => {
      this.inputs.moves = moves;
      this.inputs.userProfile = userProfile;
      this.inputs.moveList = moveList;
      this.inputs.moveLists = moveLists;
    });
  }

  static get: GetFacet<MovesContainer>;
}
