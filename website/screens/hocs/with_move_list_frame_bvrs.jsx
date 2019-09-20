// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";

import { withMoveContainer } from "screens/hocs/with_move_container";
import { withMoveListContainer } from "screens/hocs/with_move_list_container";
import { MoveCrudBvrsContext } from "screens/bvrs/move_crud_behaviours";
import { MoveListCrudBvrsContext } from "screens/bvrs/move_list_crud_behaviours";

import { getId } from "app/utils";

import { useSelectItems } from "screens/bvrs/move_selection_behaviours";
import { useMoveClipboard } from "screens/bvrs/move_clipboard_behaviours";
import { createMoveCrudBvrs } from "screens/bvrs/move_crud_behaviours";
import { createMoveListCrudBvrs } from "screens/bvrs/move_list_crud_behaviours";
import { useNavigation } from "screens/bvrs/navigation_behaviour";
import {
  useDragging,
  createDraggingBvr,
} from "move_lists/bvrs/drag_behaviours";

import type { MoveT } from "moves/types";
import type { MoveListT } from "move_lists/types";
import type { UserProfileT } from "profiles/types";
import type { DataContainerT } from "screens/containers/data_container";
import type { SelectItemsBvrT } from "screens/bvrs/move_selection_behaviours";
import type { DraggingBvrT } from "move_lists/bvrs/drag_behaviours";

// MoveListFrame

type PropsT = {
  userProfile: UserProfileT,
  moveContainer: DataContainerT<MoveT>,
  moveListContainer: DataContainerT<MoveListT>,
  moveLists: Array<MoveListT>,
  highlightedMove: ?MoveT,
  moveList: ?MoveListT,
  // receive any actions as well
};

export type SelectMovesBvrT = SelectItemsBvrT<MoveT>;

// $FlowFixMe
export const withMoveListFrameBvrs = compose(
  withMoveContainer,
  withMoveListContainer,
  Ctr.connect(
    state => ({
      userProfile: Ctr.fromStore.getUserProfile(state),
      moveLists: Ctr.fromStore.getFilteredMoveLists(state),
      highlightedMove: Ctr.fromStore.getHighlightedMove(state),
      moveList: Ctr.fromStore.getSelectedMoveList(state),
    }),
    Ctr.actions
  ),
  (WrappedComponent: any) => (props: any) => {
    const {
      userProfile,
      moveList,
      moveLists,
      moveContainer,
      moveListContainer,
      highlightedMove,
      ...passThroughProps
    }: PropsT = props;

    const actions: any = props;

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
      actions.actAddMoves
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
      actions.actInsertMoves,
      actions.actRemoveMoves
    );

    const moveListCrudBvrs = createMoveListCrudBvrs(
      userProfile,
      moveListContainer,
      getId(moveList),
      navigationBvr.setNextSelectedMoveListId,
      actions.actAddMoveLists
    );

    const draggingBvr: DraggingBvrT = createDraggingBvr(
      moveContainer.preview,
      selectMovesBvr,
      moveCrudBvrs.newMoveBvr,
      moveCrudBvrs.insertMovesBvr
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
