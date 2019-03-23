// @flow

import * as React from "react";
import { compose } from "redux";

import MovesCtr from "moves/containers/index";
import AppCtr from "app/containers/index";

import { withMoveContainer } from "moves/containers/with_move_container";
import { withMoveListContainer } from "moves/containers/with_move_list_container";

import { getId } from "app/utils";

import { useSelectItems } from "moves/containers/move_selection_behaviours";
import { useMoveClipboard } from "moves/containers/move_clipboard_behaviours";
import { createMoveCrudBvrs } from "moves/containers/move_crud_behaviours";
import { createMoveListCrudBvrs } from "moves/containers/move_list_crud_behaviours";
import { useNavigation } from "app/containers/navigation_bvr";

import type { MoveListT, MoveT } from "moves/types";
import type { UUID, UserProfileT } from "app/types";
import type { DataContainerT } from "moves/containers/data_container"; // TODO
import type { NavigationBvrT } from "app/containers/navigation_bvr";
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
  MovesCtr.connect(
    state => ({
      userProfile: AppCtr.fromStore.getUserProfile(state),
      moveLists: MovesCtr.fromStore.getFilteredMoveLists(state),
      highlightedMove: MovesCtr.fromStore.getHighlightedMove(state),
      moveList: MovesCtr.fromStore.getSelectedMoveList(state),
    }),
    {
      ...AppCtr.actions,
      ...MovesCtr.actions,
    }
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

    const highlightedMoveId = getId(highlightedMove);
    const selectedMoveListId = getId(moveList);

    const moveCrudBvrs = createMoveCrudBvrs(
      moveList,
      userProfile,
      highlightedMoveId,
      navigationBvr.setNextHighlightedMoveId,
      moveContainer,
      navigationBvr.browseToMove,
      actions.actAddMoves
    );

    const selectMovesBvr = useSelectItems<MoveT>(
      moveContainer.preview,
      highlightedMoveId,
      moveCrudBvrs.newMoveBvr.setHighlightedItemId
    );

    const moveClipboardBvr = useMoveClipboard(
      moveLists,
      selectMovesBvr.selectedItems.map(x => x.id),
      highlightedMoveId,
      moveCrudBvrs.newMoveBvr.setHighlightedItemId,
      actions.actInsertMoves,
      actions.actRemoveMoves
    );

    const moveListCrudBvrs = createMoveListCrudBvrs(
      userProfile,
      moveListContainer,
      selectedMoveListId,
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
