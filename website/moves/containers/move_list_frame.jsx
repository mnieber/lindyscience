// @flow

import * as React from "react";
import MovesCtr from "moves/containers/index";
import { withMoveContainer } from "moves/containers/with_move_container";
import { withMoveListContainer } from "moves/containers/with_move_list_container";
import AppCtr, { browseToMove } from "app/containers/index";

import Widgets from "moves/presentation/index";

import { makeMoveListUrl } from "moves/utils";
import { getId } from "app/utils";

import { useSelectItems } from "moves/containers/move_selection_behaviours";
import { useMoveClipboard } from "moves/containers/move_clipboard_behaviours";
import { createMoveCrudBvrs } from "moves/containers/move_crud_behaviours";
import { createMoveListCrudBvrs } from "moves/containers/move_list_crud_behaviours";
import { useNavigation } from "app/containers/navigation_bvr";

import { MoveCrudBvrsContext } from "moves/containers/move_crud_behaviours";
import { MoveListCrudBvrsContext } from "moves/containers/move_list_crud_behaviours";

import type { MoveListT, VideoLinksByIdT, MoveT } from "moves/types";
import type { UUID, UserProfileT, SlugidT, TagT } from "app/types";
import type { DataContainerT } from "moves/containers/data_container"; // TODO
import type { NavigationBvrT } from "app/containers/navigation_bvr";

// MoveListFrame

type MoveListFramePropsT = {
  userProfile: UserProfileT,
  moveContainer: DataContainerT<MoveT>,
  moveListContainer: DataContainerT<MoveListT>,
  videoLinksByMoveId: VideoLinksByIdT,
  moveTags: Array<TagT>,
  moveLists: Array<MoveListT>,
  highlightedMove: ?MoveT,
  moveList: ?MoveListT,
  children: any,
  // receive any actions as well
  ownerUsername: string,
  moveListSlug: string,
};

function MoveListFrame(props: MoveListFramePropsT) {
  const actions: any = props;

  const navigationBvr = useNavigation(
    props.moveList,
    props.moveLists,
    props.moveContainer.preview
  );

  React.useEffect(() => {
    actions.actSetSelectedMoveListUrl(props.ownerUsername, props.moveListSlug);
  }, [props.ownerUsername, props.moveListSlug]);

  const highlightedMoveId = getId(props.highlightedMove);
  const selectedMoveListId = getId(props.moveList);

  const moveCrudBvrs = createMoveCrudBvrs(
    props.moveList,
    props.userProfile,
    highlightedMoveId,
    navigationBvr.setNextHighlightedMoveId,
    props.moveContainer,
    navigationBvr.browseToMove,
    actions.actAddMoves
  );

  const filterMoves = (tags, keywords) => {
    const slugid = actions.actSetMoveListFilter(tags, keywords);
    if (props.moveList && slugid) {
      browseToMove([makeMoveListUrl(props.moveList), slugid]);
    }
  };

  // TODO: when clicking to highlight something, we should also select it...

  const selectMovesBvr = useSelectItems<MoveT>(
    props.moveContainer.preview,
    highlightedMoveId,
    moveCrudBvrs.newMoveBvr.setHighlightedItemId
  );

  const moveClipboardBvr = useMoveClipboard(
    props.moveLists,
    selectMovesBvr.selectedItems.map(x => x.id),
    highlightedMoveId,
    moveCrudBvrs.newMoveBvr.setHighlightedItemId,
    actions.actInsertMoves,
    actions.actRemoveMoves
  );

  const moveListCrudBvrs = createMoveListCrudBvrs(
    props.userProfile,
    props.moveListContainer,
    selectedMoveListId,
    navigationBvr.setNextSelectedMoveListId,
    actions.actAddMoveLists
  );

  return (
    <Widgets.MoveListPanel
      userProfile={props.userProfile}
      moveList={props.moveList}
      moves={props.moveContainer.preview}
      moveCrudBvrs={moveCrudBvrs}
      moveLists={props.moveLists}
      moveListCrudBvrs={moveListCrudBvrs}
      moveClipboardBvr={moveClipboardBvr}
      selectMovesBvr={selectMovesBvr}
      moveTags={props.moveTags}
      videoLinksByMoveId={props.videoLinksByMoveId}
      highlightedMove={props.highlightedMove}
      filterMoves={filterMoves}
      selectMoveListById={navigationBvr.setNextSelectedMoveListId}
    >
      <MoveListCrudBvrsContext.Provider value={moveListCrudBvrs}>
        <MoveCrudBvrsContext.Provider value={moveCrudBvrs}>
          {props.children}
        </MoveCrudBvrsContext.Provider>
      </MoveListCrudBvrsContext.Provider>
    </Widgets.MoveListPanel>
  );
}

// $FlowFixMe
MoveListFrame = withMoveListContainer(
  withMoveContainer(
    MovesCtr.connect(
      state => ({
        userProfile: AppCtr.fromStore.getUserProfile(state),
        videoLinksByMoveId: MovesCtr.fromStore.getVideoLinksByMoveId(state),
        moves: MovesCtr.fromStore.getFilteredMovesInList(state),
        moveTags: MovesCtr.fromStore.getMoveTags(state),
        moveLists: MovesCtr.fromStore.getMoveLists(state),
        highlightedMove: MovesCtr.fromStore.getHighlightedMove(state),
        moveList: MovesCtr.fromStore.getSelectedMoveList(state),
      }),
      {
        ...AppCtr.actions,
        ...MovesCtr.actions,
      }
    )(MoveListFrame)
  )
);

export default MoveListFrame;
