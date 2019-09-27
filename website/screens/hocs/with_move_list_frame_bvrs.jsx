// @flow

import * as React from "react";
import { compose } from "redux";

import { actSetIsEditingMove, actSetIsEditingMoveList } from "screens/actions";
import {
  actAddMoveLists,
  actInsertMoveIds,
  actRemoveMoveIds,
} from "move_lists/actions";
import {
  type SelectItemsBvrT,
  useSelectItems,
} from "screens/bvrs/move_selection_behaviours";
import {
  type DraggingBvrT,
  createDraggingBvr,
  useDragging,
} from "move_lists/bvrs/drag_behaviours";
import {
  MoveCrudBvrsContext,
  createMoveCrudBvrs,
} from "screens/bvrs/move_crud_behaviours";
import {
  MoveListCrudBvrsContext,
  createMoveListCrudBvrs,
} from "screens/bvrs/move_list_crud_behaviours";
import { actAddMoves } from "moves/actions";
import Ctr from "screens/containers/index";
import { withMoveContainer } from "screens/hocs/with_move_container";
import { withMoveListContainer } from "screens/hocs/with_move_list_container";
import { getId } from "app/utils";
import { useMoveClipboard } from "screens/bvrs/move_clipboard_behaviours";
import { useNavigation } from "screens/bvrs/navigation_behaviour";
import type { MoveT } from "moves/types";
import type { MoveListT } from "move_lists/types";
import type { UserProfileT } from "profiles/types";
import type { DataContainerT } from "screens/containers/data_container";

// MoveListFrame

type PropsT = {
  userProfile: UserProfileT,
  moveContainer: DataContainerT<MoveT>,
  moveListContainer: DataContainerT<MoveListT>,
  moveLists: Array<MoveListT>,
  highlightedMove: ?MoveT,
  moveList: ?MoveListT,
  isEditingMove: boolean,
  isEditingMoveList: boolean,
  // receive any actions as well
};

export type SelectMovesBvrT = SelectItemsBvrT<MoveT>;

// $FlowFixMe
export const withMoveListFrameBvrs = compose(
  withMoveContainer,
  withMoveListContainer,
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    moveLists: Ctr.fromStore.getFilteredMoveLists(state),
    highlightedMove: Ctr.fromStore.getHighlightedMove(state),
    moveList: Ctr.fromStore.getSelectedMoveList(state),
    isEditingMove: Ctr.fromStore.getIsEditingMove(state),
    isEditingMoveList: Ctr.fromStore.getIsEditingMoveList(state),
  })),
  (WrappedComponent: any) => (props: any) => {
    const {
      userProfile,
      moveList,
      moveLists,
      moveContainer,
      moveListContainer,
      highlightedMove,
      isEditingMove,
      isEditingMoveList,
      ...passThroughProps
    }: PropsT = props;

    const navigationBvr = useNavigation(
      moveList,
      moveLists,
      moveContainer.preview
    );

    const moveCrudBvrs = createMoveCrudBvrs(
      moveList,
      userProfile,
      getId(highlightedMove),
      navigationBvr.setNextHighlightedMoveId,
      moveContainer,
      navigationBvr.browseToMove,
      moves => props.dispatch(actAddMoves(moves)),
      isEditingMove,
      isEditing => props.dispatch(actSetIsEditingMove(isEditing))
    );

    const selectMovesBvr = useSelectItems<MoveT>(
      moveContainer.preview,
      getId(highlightedMove),
      moveCrudBvrs.setHighlightedMoveId
    );

    const moveClipboardBvr = useMoveClipboard(
      moveLists,
      selectMovesBvr.selectedItems,
      getId(highlightedMove),
      moveCrudBvrs.setHighlightedMoveId,
      (moveIds, moveListId, targetMoveId, isBefore) =>
        props.dispatch(
          actInsertMoveIds(moveIds, moveListId, targetMoveId, isBefore)
        ),
      (moveIds, moveListId) =>
        props.dispatch(actRemoveMoveIds(moveIds, moveListId))
    );

    const moveListCrudBvrs = createMoveListCrudBvrs(
      userProfile,
      moveListContainer,
      getId(moveList),
      navigationBvr.setNextSelectedMoveListId,
      moveLists => props.dispatch(actAddMoveLists(moveLists)),
      isEditingMoveList,
      isEditing => props.dispatch(actSetIsEditingMoveList(isEditing))
    );

    const draggingBvr: DraggingBvrT = createDraggingBvr(
      moveContainer,
      selectMovesBvr,
      moveCrudBvrs.newMoveBvr
    );

    return (
      <MoveListCrudBvrsContext.Provider value={moveListCrudBvrs}>
        <MoveCrudBvrsContext.Provider value={moveCrudBvrs}>
          <WrappedComponent
            navigationBvr={navigationBvr}
            selectMovesBvr={selectMovesBvr}
            moveClipboardBvr={moveClipboardBvr}
            draggingBvr={draggingBvr}
            {...passThroughProps}
          />
        </MoveCrudBvrsContext.Provider>
      </MoveListCrudBvrsContext.Provider>
    );
  }
);
