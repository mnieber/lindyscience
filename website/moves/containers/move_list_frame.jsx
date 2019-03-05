// @flow

import * as appActions from 'app/actions'
import * as movesActions from 'moves/actions'
import * as api from 'moves/api'
import * as fromStore from 'moves/reducers'
import * as fromAppStore from 'app/reducers'
import * as React from 'react'
import { navigate } from "@reach/router"
import { connect } from 'react-redux'
import { createErrorHandler } from 'app/utils'
import { MoveListPanel } from 'moves/presentation/move_list_panel';
import { makeSlugidMatcher, makeMoveListUrl, findMoveBySlugid, newMoveSlug } from 'moves/utils';
import {
  useInsertMove, useNewMove, useSaveMove, MoveCrudBvrsContext
} from 'moves/containers/move_crud_behaviours'
import type {
  MoveListT, VideoLinksByIdT, MoveT, MoveCrudBvrsT
} from 'moves/types'
import type { UUID, UserProfileT, SlugidT, TagT } from 'app/types';
import type { SaveMoveBvrT, InsertMoveBvrT, NewMoveBvrT } from 'moves/containers/move_crud_behaviours'


export function browseToMove(moveUrlParts: Array<string>, mustUpdateProfile: boolean=true) {
  const moveUrl = moveUrlParts.filter(x => !!x).join('/');
  navigate(`/app/list/${moveUrl}`);
  if (mustUpdateProfile) {
    api.updateProfile(moveUrl);
  }
}


function _setHighlightedMoveId(moves: Array<MoveT>, moveId: UUID, moveListUrl: string) {
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

export type _MoveListFramePropsT = {
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
};

function _MoveListFrame(props: _MoveListFramePropsT) {
  const actions: any = props;

  const [isEditing, setIsEditing] = React.useState(false);

  const insertMoveBvr: InsertMoveBvrT = useInsertMove(
    props.moves,
    actions.actInsertMoves,
    props.moveList ? props.moveList.id : "",
    createErrorHandler
  );

  const [nextHighlightedMoveId, setNextHighlightedMoveId] = React.useState(null);
  React.useEffect(
    () => {
      if (props.moveList && nextHighlightedMoveId != null) {
        _setHighlightedMoveId(
          insertMoveBvr.preview, nextHighlightedMoveId, makeMoveListUrl(props.moveList)
        );
      }
    },
    [nextHighlightedMoveId]
  )

  const highlightedMoveInStore = findMoveBySlugid(
    props.moves, props.highlightedMoveSlugid
  );

  const newMoveBvr: NewMoveBvrT = useNewMove(
    props.userProfile,
    setNextHighlightedMoveId,
    highlightedMoveInStore ? highlightedMoveInStore.id : "",
    insertMoveBvr,
    setIsEditing,
  );

  const saveMoveBvr: SaveMoveBvrT = useSaveMove(
    insertMoveBvr.preview,
    newMoveBvr,
    setIsEditing,
    actions.actAddMoves,
    createErrorHandler
  );

  const bvrs: MoveCrudBvrsT = {
    isEditing,
    setIsEditing,
    insertMoveBvr,
    newMoveBvr,
    saveMoveBvr
  };

  return (
    <MoveListPanel
      userProfile={props.userProfile}
      videoLinksByMoveId={props.videoLinksByMoveId}
      bvrs={bvrs}
      moveTags={props.moveTags}
      moveLists={props.moveLists}
      highlightedMoveSlugid={props.highlightedMoveSlugid}
      moveList={props.moveList}
      actSetMoveListFilter={actions.actSetMoveListFilter}
    >
      <MoveCrudBvrsContext.Provider value={bvrs}>
        {props.children}
      </MoveCrudBvrsContext.Provider>
    </MoveListPanel>
  )
}


type MoveListFramePropsT = _MoveListFramePropsT & {
  ownerUsername: string,
  moveListSlug: string,
};

function MoveListFrame(props: MoveListFramePropsT) {
  const actions: any = props;

  React.useEffect(
    () => {actions.actSelectMoveListByUrl(props.ownerUsername, props.moveListSlug)},
    [props.ownerUsername, props.moveListSlug,]
  );

  return _MoveListFrame(props);
}


// $FlowFixMe
MoveListFrame = connect(
  (state) => ({
    userProfile: fromAppStore.getUserProfile(state.app),
    videoLinksByMoveId: fromStore.getVideoLinksByMoveId(state.moves),
    moves: fromStore.getFilteredMovesInList(state.moves),
    allMoves: fromStore.getMovesInList(state.moves),
    moveTags: fromStore.getMoveTags(state.moves),
    moveLists: fromStore.getMoveLists(state.moves),
    highlightedMoveSlugid: fromStore.getHighlightedMoveSlugid(state.moves),
    moveList: fromStore.getSelectedMoveList(state.moves),
  }),
  {
    ...appActions,
    ...movesActions,
  }
)(MoveListFrame)

export default MoveListFrame;
