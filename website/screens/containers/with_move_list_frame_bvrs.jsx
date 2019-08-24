// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";

import { withMoveContainer } from "screens/containers/with_move_container";
import { withMoveListContainer } from "screens/containers/with_move_list_container";

import { getId } from "app/utils";

import { useSelectItems } from "screens/containers/move_selection_behaviours";
import { useMoveClipboard } from "screens/containers/move_clipboard_behaviours";
import { createMoveCrudBvrs } from "screens/containers/move_crud_behaviours";
import { createMoveListCrudBvrs } from "screens/containers/move_list_crud_behaviours";
import { useNavigation } from "screens/containers/navigation_bvr";

import type { MoveT } from "moves/types";
import type { MoveListT } from "screens/types";
import type { UserProfileT } from "profiles/types";
import type { DataContainerT } from "screens/containers/data_container";
import type { SelectItemsBvrT } from "screens/containers/move_selection_behaviours";

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
