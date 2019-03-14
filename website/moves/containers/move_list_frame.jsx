// @flow

import * as React from 'react'
import MovesCtr from 'moves/containers/index'
import AppCtr from 'app/containers/index'

import Widgets from 'moves/presentation/index'
import { browseToMove } from 'app/containers/appframe';

import {
  makeSlugidMatcher,
  makeMoveListUrl,
  newMoveSlug,
  findMoveBySlugid,
} from 'moves/utils';

import { useSelectItems } from 'moves/containers/move_selection_behaviours'
import { useMoveClipboard } from 'moves/containers/move_clipboard_behaviours'
import {
  MoveCrudBvrsContext, createMoveCrudBvrs
} from 'moves/containers/move_crud_behaviours'
import { MoveListCrudBvrsContext } from 'moves/containers/move_list_crud_behaviours'

import type {
  MoveListT, VideoLinksByIdT, MoveT, MoveListCrudBvrsT
} from 'moves/types'
import type { UUID, UserProfileT, SlugidT, TagT } from 'app/types';
import type { SaveMoveBvrT, InsertMovesBvrT, NewMoveBvrT } from 'moves/containers/move_crud_behaviours'


function _browseToMove(moves: Array<MoveT>, move: MoveT, moveListUrl: string) {
  const matcher = makeSlugidMatcher(move.slug);
  const isSlugUnique = moves.filter(matcher).length <= 1;
  const updateProfile = move.slug != newMoveSlug;
  const maybeMoveId = isSlugUnique ? "" : (move ? move.id : "");
  browseToMove(
    [moveListUrl, move.slug, maybeMoveId],
    updateProfile
  );
}


// MoveListFrame

type MoveListFramePropsT = {
  userProfile: UserProfileT,
  videoLinksByMoveId: VideoLinksByIdT,
  moves: Array<MoveT>,
  moveTags: Array<TagT>,
  moveLists: Array<MoveListT>,
  highlightedMoveSlugid: SlugidT,
  moveList: ?MoveListT,
  children: any,
  // receive any actions as well
  ownerUsername: string,
  moveListSlug: string,
};

type _MoveListFramePropsT = MoveListFramePropsT & {
  moveListCrudBvrs: MoveListCrudBvrsT
};

function _MoveListFrame(props: _MoveListFramePropsT) {
  const actions: any = props;
  const [nextHighlightedMoveId, setNextHighlightedMoveId] = React.useState(null);

  function _updateMove(oldMove: MoveT, newMove: MoveT) {
    actions.actAddMoves([newMove]);
    if (highlightedMove && highlightedMove.id == oldMove.id) {
      _browseToMove(moves, newMove, makeMoveListUrl(props.moveList));
    }
  }

  const moveCrudBvrs = createMoveCrudBvrs(
    props.moves,
    props.moveList,
    props.userProfile,
    props.highlightedMoveSlugid,
    setNextHighlightedMoveId,
    _updateMove,
    actions.actInsertMoves,
  );

  const moves = moveCrudBvrs.insertMovesBvr.preview;
  const highlightedMove = findMoveBySlugid(moves, props.highlightedMoveSlugid);
  const highlightedMoveId = highlightedMove ? highlightedMove.id : "";

  React.useEffect(
    () => {
      if (props.moveList && nextHighlightedMoveId != null) {
        const move = (
          moves.find(x => x.id == nextHighlightedMoveId) ||
          moves.find(x => true)
        );
        if (move) {
          _browseToMove(moves, move, makeMoveListUrl(props.moveList));
        }
      }
    },
    [nextHighlightedMoveId]
  )

  const selectMoveListById = (id: UUID) => {
    const moveList = props.moveLists.find(x => x.id == id);
    if (moveList) {
      browseToMove([moveList.ownerUsername, moveList.slug]);
    }
  }

  const filterMoves = (tags, keywords) => {
    const slugid = actions.actSetMoveListFilter(tags, keywords);
    if (props.moveList && slugid) {
      browseToMove([makeMoveListUrl(props.moveList), slugid])
    }
  }

  // TODO: when clicking to highlight something, we should also select it...

  const selectMovesBvr = useSelectItems<MoveT>(
    moves,
    highlightedMoveId,
    moveCrudBvrs.newMoveBvr.setHighlightedItemId
  );

  const moveClipboardBvr = useMoveClipboard(
    props.moveLists,
    selectMovesBvr.selectedItems.map(x => x.id),
    highlightedMoveId,
    moveCrudBvrs.newMoveBvr.setHighlightedItemId,
    actions.actInsertMoves,
    actions.actRemoveMoves,
  );

  return (
    <Widgets.MoveListPanel
      userProfile={props.userProfile}
      videoLinksByMoveId={props.videoLinksByMoveId}
      moveCrudBvrs={moveCrudBvrs}
      moveListCrudBvrs={props.moveListCrudBvrs}
      moveClipboardBvr={moveClipboardBvr}
      moveTags={props.moveTags}
      moveLists={props.moveLists}
      selectMovesBvr={selectMovesBvr}
      highlightedMoveSlugid={props.highlightedMoveSlugid}
      moveList={props.moveList}
      filterMoves={filterMoves}
      selectMoveListById={selectMoveListById}
    >
      <MoveCrudBvrsContext.Provider value={moveCrudBvrs}>
        {props.children}
      </MoveCrudBvrsContext.Provider>
    </Widgets.MoveListPanel>
  )
}


function MoveListFrame(props: MoveListFramePropsT) {
  const actions: any = props;

  React.useEffect(
    () => {actions.actSelectMoveListByUrl(props.ownerUsername, props.moveListSlug)},
    [props.ownerUsername, props.moveListSlug,]
  );

  return (
    <MoveListCrudBvrsContext.Consumer>{moveListCrudBvrs =>
      <_MoveListFrame
        {...props}
        moveListCrudBvrs={moveListCrudBvrs}
      />
    }</MoveListCrudBvrsContext.Consumer>
  );
}


// $FlowFixMe
MoveListFrame = MovesCtr.connect(
  (state) => ({
    userProfile: AppCtr.fromStore.getUserProfile(state.app),
    videoLinksByMoveId: MovesCtr.fromStore.getVideoLinksByMoveId(state.moves),
    moves: MovesCtr.fromStore.getFilteredMovesInList(state.moves),
    moveTags: MovesCtr.fromStore.getMoveTags(state.moves),
    moveLists: MovesCtr.fromStore.getMoveLists(state.moves),
    highlightedMoveSlugid: MovesCtr.fromStore.getHighlightedMoveSlugid(state.moves),
    moveList: MovesCtr.fromStore.getSelectedMoveList(state.moves),
  }),
  {
    ...AppCtr.actions,
    ...MovesCtr.actions,
  }
)(MoveListFrame)

export default MoveListFrame;
