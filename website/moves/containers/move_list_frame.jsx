// @flow

import * as appActions from 'app/actions'
import * as movesActions from 'moves/actions'
import * as api from 'moves/api'
import * as fromStore from 'moves/reducers'
import * as fromAppStore from 'app/reducers'
import * as React from 'react'
import { navigate } from "@reach/router"
import { connect } from 'react-redux'
import { makeMoveListUrl, makeSlugidMatcher } from 'moves/utils'
import { createErrorHandler } from 'utils/utils'
import { MoveListPanel } from 'moves/presentation/move_list_panel';
import { findMoveBySlugid, newMoveSlug } from 'moves/utils';
import {
  useInsertMove, useNewMove, useSaveMove, MoveCrudBvrsContext
} from 'moves/containers/move_crud_behaviours'
import type {
  MoveListT, VideoLinksByIdT, TagT, MoveT, MoveCrudBvrsT
} from 'moves/types'
import type { UUID, UserProfileT, SlugidT } from 'app/types';
import type { SaveMoveBvrT, InsertMoveBvrT, NewMoveBvrT } from 'moves/containers/move_crud_behaviours'


export function browseToMove(moveUrlParts: Array<string>, mustUpdateProfile: boolean=true) {
  const moveUrl = moveUrlParts.filter(x => !!x).join('/');
  navigate(`/app/list/${moveUrl}`);
  if (mustUpdateProfile) {
    api.updateProfile(moveUrl);
  }
}


function _setHighlightedMoveId(
  moveList: ?MoveListT, allMoves: Array<MoveT>, moveId: UUID
) {
  const move = allMoves.find(x => x.id == moveId) || allMoves.find(x => true);
  if (moveList && move) {
    const matcher = makeSlugidMatcher(move.slug);
    const isSlugUnique = allMoves.filter(matcher).length <= 1;
    const updateProfile = move.slug != newMoveSlug;
    browseToMove(
      [
        makeMoveListUrl(moveList),
        move.slug,
        isSlugUnique ? "" : (move ? move.id : ""),
      ],
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

  const highlightedMoveInStore = findMoveBySlugid(
    props.moves, props.highlightedMoveSlugid
  );

  const [isEditing, setIsEditing] = React.useState(false);

  const insertMoveBvr: InsertMoveBvrT = useInsertMove(
    props.moves,
    actions.actInsertMoves,
    props.moveList ? props.moveList.id : "",
    createErrorHandler
  );

  const newMoveBvr: NewMoveBvrT = useNewMove(
    props.userProfile,
    highlightedMoveInStore ? highlightedMoveInStore.id : "",
    moveId => _setHighlightedMoveId(props.moveList, insertMoveBvr.preview, moveId),
    insertMoveBvr,
    setIsEditing,
  );

  const saveMoveBvr: SaveMoveBvrT = useSaveMove(
    insertMoveBvr.preview,
    newMoveBvr,
    setIsEditing,
    actions.actUpdateMoves,
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
