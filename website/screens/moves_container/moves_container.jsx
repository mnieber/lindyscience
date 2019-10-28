// @flow

import type { GetBvrT } from "facets/index";
import { getIds } from "app/utils";
import { MovesData, initMovesData } from "screens/moves_container/moves_data";
import type { MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import { facet, mapData, facetClass } from "facets/index";
import { Addition, initAddition } from "facets/generic/addition";
import { Dragging, initDragging } from "facets/generic/dragging";
import { Editing, initEditing } from "facets/generic/editing";
import { Filtering, initFiltering } from "facets/generic/filtering";
import { Highlight, initHighlight } from "facets/generic/highlight";
import { Insertion, initInsertion } from "facets/generic/insertion";
import { Selection, initSelection } from "facets/generic/selection";
import { Clipboard } from "facets/generic/clipboard";
import { SelectWithKeys } from "facets/handlers/select_with_keys";
import { ClickToSelectItems } from "facets/handlers/click_to_select_items";
import { DragItems } from "facets/handlers/drag_items";
import type { UserProfileT } from "profiles/types";
import { Policies } from "facets/policies";
import { insertByCreatingAnItem } from "facets/policies/insert_by_creating_a_new_item";
import { insertByDraggingSelection } from "facets/policies/insert_by_dragging_selection";
import { runInAction } from "utils/mobx_wrapper";
import { createTagsAndKeywordsFilter } from "screens/utils";
import { createNewMove } from "screens/moves_container/moves_container_props";

type MovesContainerPropsT = {
  setMoves: (MoveListT, Array<MoveT>) => any,
  saveMove: (MoveT, values: any) => any,
  shareMovesToList: (Array<MoveT>, MoveListT, ?MoveListT) => any,
  storeHighlight: () => void,
  restoreHighlight: () => void,
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
  @facet(MovesData) data: MovesData;
  @facet(Selection) selection: Selection;

  clipboard: Clipboard;

  handlerSelectWithKeys = new SelectWithKeys({ container: this });
  handlerClick = new ClickToSelectItems({ container: this });
  handlerDrag = new DragItems({ container: this });

  _createBehaviours(props: MovesContainerPropsT) {
    this.addition = initAddition(new Addition(), {
      createItem: (values: any) => {
        return this.data._moveList && this.data._userProfile
          ? createNewMove(this.data._userProfile, this.data._moveList.id)
          : undefined;
      },
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
        if (this.data._moveList) {
          props.setMoves(this.data._moveList, preview);
        }
      },
    });
    this.data = initMovesData(new MovesData());
    this.selection = initSelection(new Selection());
  }

  _applyPolicies(props: MovesContainerPropsT) {
    const itemById = [MovesData, "moveById"];
    const inputItems = [MovesData, "moves"];
    const preview = [MovesData, "preview"];

    [
      Policies.selection.actsOnItems(itemById),

      Policies.highlight.actsOnItems(itemById),
      Policies.highlight.followsSelection,
      Policies.highlight.isStoredOnNewItem(props.storeHighlight),
      Policies.highlight.isRestoredOnCancelNewItem(props.restoreHighlight),
      Policies.highlight.isCorrectedOnFilterChange,

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

      mapData([Filtering, "filteredItems"], [MovesData, "display"]),
      mapData([MovesData, "display"], [Selection, "selectableIds"], getIds),
    ].forEach(policy => policy(this));
  }

  constructor(props: MovesContainerPropsT) {
    this._createBehaviours(props);
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
      this.data.moves = moves;
      this.data._userProfile = userProfile;
      this.data._moveList = moveList;
      this.data._moveLists = moveLists;
    });
  }

  static get: GetBvrT<MovesContainer>;
}
