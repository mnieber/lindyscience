// @flow

import * as React from 'react'
import MovesCtr from 'moves/containers/index'
import AppCtr from 'app/containers/index'

import Widgets from 'moves/presentation/index'
import { browseToMove } from 'app/containers/appframe';

import {
  makeSlugidMatcher, makeMoveListUrl, newMoveSlug,
} from 'moves/utils';

import {
  MoveCrudBvrsContext, createMoveCrudBvrs
} from 'moves/containers/move_crud_behaviours'
import { MoveListCrudBvrsContext } from 'moves/containers/move_list_crud_behaviours'

import type {
  MoveListT, VideoLinksByIdT, MoveT, MoveListCrudBvrsT
} from 'moves/types'
import type { UUID, UserProfileT, SlugidT, TagT } from 'app/types';
import type { SaveMoveBvrT, InsertMoveBvrT, NewMoveBvrT } from 'moves/containers/move_crud_behaviours'


function _setHighlightedMoveById(moves: Array<MoveT>, moveId: UUID, moveListUrl: string) {
  const move = (
    moves.find(x => x.id == moveId) ||
    moves.find(x => true)
  );

  if (move) {
    const matcher = makeSlugidMatcher(move.slug);
    const isSlugUnique = moves.filter(matcher).length <= 1;
    const updateProfile = move.slug != newMoveSlug;
    const maybeMoveId = isSlugUnique ? "" : (move ? move.id : "");
    browseToMove(
      [moveListUrl, move.slug, maybeMoveId],
      updateProfile
    );
  }
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
  React.useEffect(
    () => {
      if (props.moveList && nextHighlightedMoveId != null) {
        _setHighlightedMoveById(
          moveCrudBvrs.insertMoveBvr.preview,
          nextHighlightedMoveId,
          makeMoveListUrl(props.moveList)
        );
      }
    },
    [nextHighlightedMoveId]
  )

  const moveCrudBvrs = createMoveCrudBvrs(
    props.moves,
    props.moveList,
    props.userProfile,
    props.highlightedMoveSlugid,
    setNextHighlightedMoveId,
    actions.actInsertMoves,
    actions.actAddMoves,
  );

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
      actSetMoveListFilter={actions.actSetMoveListFilter}
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
