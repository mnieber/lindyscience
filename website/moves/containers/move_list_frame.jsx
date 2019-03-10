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
  findNeighbourIdx,
} from 'moves/utils';
import {
  createErrorHandler
} from 'app/utils';

import {
  MoveCrudBvrsContext, createMoveCrudBvrs
} from 'moves/containers/move_crud_behaviours'
import { MoveListCrudBvrsContext } from 'moves/containers/move_list_crud_behaviours'

import type {
  MoveListT, VideoLinksByIdT, MoveT, MoveListCrudBvrsT
} from 'moves/types'
import type { UUID, UserProfileT, SlugidT, TagT } from 'app/types';
import type { SaveMoveBvrT, InsertMoveBvrT, NewMoveBvrT } from 'moves/containers/move_crud_behaviours'


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
  allMoves: Array<MoveT>,
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

  const moveCrudBvrs = createMoveCrudBvrs(
    props.moves,
    props.moveList,
    props.userProfile,
    props.highlightedMoveSlugid,
    setNextHighlightedMoveId,
    _updateMove,
    actions.actInsertMoves,
  );

  const moves = moveCrudBvrs.insertMoveBvr.preview;

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

  function _updateMove(oldMove: MoveT, newMove: MoveT) {
    actions.actAddMoves([newMove]);
    const highlightedMove = findMoveBySlugid(moves, props.highlightedMoveSlugid);
    if (highlightedMove && highlightedMove.id == oldMove.id) {
      _browseToMove(moves, newMove, makeMoveListUrl(props.moveList));
    }
  }

  function _shareMoveToList(moveList: MoveListT) {
    const highlightedMove = findMoveBySlugid(moves, props.highlightedMoveSlugid);
    if (highlightedMove && !moveList.moves.includes(highlightedMove.id)) {
      const moveIds = actions.actInsertMoves([highlightedMove.id], moveList.id, "");
      MovesCtr.api.saveMoveOrdering(moveList.id, moveIds)
        .catch(createErrorHandler("Could not update the move list"));
    }
  }

  function _moveMoveToList(moveList: MoveListT) {
    const sourceMoveList = props.moveList;

    if (sourceMoveList && sourceMoveList.id != moveList.id) {
      const highlightedMove = findMoveBySlugid(moves, props.highlightedMoveSlugid);
      const moveIds = moves.map(x => x.id);
      const highlightedIdx = moveIds.indexOf(highlightedMove.id);

      _shareMoveToList(moveList);
      const newMoveIds = actions.actRemoveMoves([highlightedMove.id], sourceMoveList.id);
      MovesCtr.api.saveMoveOrdering(sourceMoveList.id, newMoveIds)
        .catch(createErrorHandler("Could not update the move list"));

      const newIdx =
        findNeighbourIdx(newMoveIds, moveIds, highlightedIdx, moveIds.length, 1) ||
        findNeighbourIdx(newMoveIds, moveIds, highlightedIdx, -1, -1);

      if (newIdx) {
        _browseToMove(moves, moves[newIdx.result], makeMoveListUrl(sourceMoveList));
      }
    }
  }

  const selectMoveListById = id => {
    const moveList = props.moveLists.find(x => x.id == id);
    if (moveList) {
      browseToMove([moveList.ownerUsername, moveList.slug]);
    }
  }

  const filterMovesByTags = tags => {
    const slugid = actions.actSetMoveListFilter(tags, true);
    if (props.moveList && slugid) {
      browseToMove([makeMoveListUrl(props.moveList), slugid])
    }
  }

  return (
    <Widgets.MoveListPanel
      userProfile={props.userProfile}
      videoLinksByMoveId={props.videoLinksByMoveId}
      moveCrudBvrs={moveCrudBvrs}
      moveListCrudBvrs={props.moveListCrudBvrs}
      moveTags={props.moveTags}
      moveLists={props.moveLists}
      highlightedMoveSlugid={props.highlightedMoveSlugid}
      moveList={props.moveList}
      filterMovesByTags={filterMovesByTags}
      shareMoveToList={_shareMoveToList}
      moveMoveToList={_moveMoveToList}
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
    allMoves: MovesCtr.fromStore.getMovesInList(state.moves),
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
