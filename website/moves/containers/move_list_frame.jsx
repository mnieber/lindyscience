// @flow

import * as React from "react";
import { compose } from "redux";
import MovesCtr from "moves/containers/index";
import AppCtr, { browseToMove } from "app/containers/index";

import Widgets from "moves/presentation/index";

import { makeMoveListUrl } from "moves/utils";

import { withMoveListFrameBvrs } from "moves/containers/with_move_list_frame_bvrs";
import { MoveCrudBvrsContext } from "moves/containers/move_crud_behaviours";
import { MoveListCrudBvrsContext } from "moves/containers/move_list_crud_behaviours";

import type {
  MoveListT,
  VideoLinksByIdT,
  MoveT,
  MoveCrudBvrsT,
  MoveListCrudBvrsT,
} from "moves/types";
import type { UUID, UserProfileT, TagT } from "app/types";
import type { NavigationBvrT } from "app/containers/navigation_bvr";
import type { SelectMovesBvrT } from "moves/containers/with_move_list_frame_bvrs";
import type { MoveClipboardBvrT } from "moves/containers/move_clipboard_behaviours";

// MoveListFrame

type MoveListFramePropsT = {
  userProfile: UserProfileT,
  videoLinksByMoveId: VideoLinksByIdT,
  navigationBvr: NavigationBvrT,
  moveCrudBvrs: MoveCrudBvrsT,
  moveListCrudBvrs: MoveListCrudBvrsT,
  selectMovesBvr: SelectMovesBvrT,
  moveClipboardBvr: MoveClipboardBvrT,
  moveTags: Array<TagT>,
  moveLists: Array<MoveListT>,
  highlightedMove: ?MoveT,
  moveList: ?MoveListT,
  children: any,
  // receive any actions as well
  ownerUsername: string,
  moveListSlug: string,
};

function _MoveListFrame(props: MoveListFramePropsT) {
  const actions: any = props;

  const filterMoves = (tags, keywords) => {
    const slugid = actions.actSetMoveListFilter(tags, keywords);
    if (props.moveList && slugid) {
      browseToMove([makeMoveListUrl(props.moveList), slugid]);
    }
  };

  return (
    <Widgets.MoveListPanel
      userProfile={props.userProfile}
      moveList={props.moveList}
      moves={props.moveCrudBvrs.insertMovesBvr.preview}
      moveCrudBvrs={props.moveCrudBvrs}
      moveLists={props.moveLists}
      moveListCrudBvrs={props.moveListCrudBvrs}
      moveClipboardBvr={props.moveClipboardBvr}
      selectMovesBvr={props.selectMovesBvr}
      moveTags={props.moveTags}
      videoLinksByMoveId={props.videoLinksByMoveId}
      highlightedMove={props.highlightedMove}
      filterMoves={filterMoves}
      selectMoveListById={
        props.moveListCrudBvrs.newMoveListBvr.setHighlightedItemId
      }
    >
      <MoveListCrudBvrsContext.Provider value={props.moveListCrudBvrs}>
        <MoveCrudBvrsContext.Provider value={props.moveCrudBvrs}>
          {props.children}
        </MoveCrudBvrsContext.Provider>
      </MoveListCrudBvrsContext.Provider>
    </Widgets.MoveListPanel>
  );
}

function MoveListFrame({ ownerUsername, moveListSlug, ...props }) {
  const actions: any = props;
  React.useEffect(() => {
    actions.actSetSelectedMoveListUrl(ownerUsername, moveListSlug);
  }, [ownerUsername, moveListSlug]);

  return <_MoveListFrame {...props} />;
}

// $FlowFixMe
MoveListFrame = compose(
  withMoveListFrameBvrs,
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
  )
)(MoveListFrame);

export default MoveListFrame;
