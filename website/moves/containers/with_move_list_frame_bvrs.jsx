// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "moves/containers/index";

import { withMoveContainer } from "moves/containers/with_move_container";
import { withMoveListContainer } from "moves/containers/with_move_list_container";

import { getId } from "app/utils";

import { useSelectItems } from "moves/containers/move_selection_behaviours";
import { useMoveClipboard } from "moves/containers/move_clipboard_behaviours";
import { createMoveCrudBvrs } from "moves/containers/move_crud_behaviours";
import { createMoveListCrudBvrs } from "moves/containers/move_list_crud_behaviours";
import { useNavigation } from "app/containers/navigation_bvr";

import type { MoveListT, MoveT } from "moves/types";
import type { UserProfileT } from "profiles/types";
import type { DataContainerT } from "moves/containers/data_container";
import type { SelectItemsBvrT } from "moves/containers/move_selection_behaviours";

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
      moveCrudBvrs.newMoveBvr.setHighlightedItemId
    );

    const moveClipboardBvr = useMoveClipboard(
      moveLists,
      selectMovesBvr.selectedItems,
      getId(highlightedMove),
      moveCrudBvrs.newMoveBvr.setHighlightedItemId,
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

    return (
      <WrappedComponent
        moveCrudBvrs={moveCrudBvrs}
        moveListCrudBvrs={moveListCrudBvrs}
        navigationBvr={navigationBvr}
        selectMovesBvr={selectMovesBvr}
        moveClipboardBvr={moveClipboardBvr}
        {...passThroughProps}
      />
    );
  }
);
