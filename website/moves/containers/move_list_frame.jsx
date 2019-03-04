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
import { findMoveBySlugid } from 'moves/utils';
import { useFlag } from 'utils/hooks'
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

  const isEditing = useFlag(false);

  const insertMoveBvr: InsertMoveBvrT = useInsertMove(
    props.moves,
    actions.actInsertMoves,
    props.moveList ? props.moveList.id : "",
    createErrorHandler
  );

  const setHighlightedMoveId = moveId => {
    const move = insertMoveBvr.preview.find(x => x.id == moveId);
    if (move) {
      const matcher = makeSlugidMatcher(move.slug);
      const isSlugUnique = props.allMoves.filter(matcher).length <= 1;
      const updateProfile = !!props.allMoves.find(matcher);
      browseToMove(
        [
          props.moveList ? makeMoveListUrl(props.moveList) : "",
          move ? move.slug : "",
          isSlugUnique ? "" : (move ? move.id : ""),
        ],
        updateProfile
      );
    }
  }

  const highlightedMove = findMoveBySlugid(
    insertMoveBvr.preview, props.highlightedMoveSlugid
  );

  const newMoveBvr: NewMoveBvrT = useNewMove(
    props.userProfile,
    highlightedMove ? highlightedMove.id : "",
    setHighlightedMoveId,
    insertMoveBvr,
    isEditing.setTrue,
    isEditing.setFalse,
  );

  const saveMoveBvr: SaveMoveBvrT = useSaveMove(
    insertMoveBvr.preview,
    newMoveBvr,
    isEditing.setFalse,
    actions.actUpdateMoves,
    createErrorHandler
  );

  const bvrs: MoveCrudBvrsT  = {
    isEditing,
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