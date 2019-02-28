// @flow

import * as appActions from 'app/actions'
import * as movesActions from 'moves/actions'
import * as React from 'react'
import { connect } from 'react-redux'
import * as fromStore from 'moves/reducers'
import * as fromAppStore from 'app/reducers'
import { Move } from 'moves/presentation/move'
import { findMoveBySlugid } from 'moves/utils'
import { StaticMove } from 'moves/presentation/static_move'
import { StaticVideoLinksPanel } from 'moves/presentation/static_videolinks_panel'
import { StaticTipsPanel } from 'moves/presentation/static_tips_panel'
import { MoveCrudBvrsContext } from 'moves/containers/move_crud_behaviours'
import type { UUID, UserProfileT, VoteByIdT, SlugidT } from 'app/types';
import type {
  MoveListT, MoveT, VideoLinksByIdT, TipsByIdT, TagT, MoveCrudBvrsT
} from 'moves/types'


type _MovePagePropsT = {
  userProfile: UserProfileT,
  videoLinksByMoveId: VideoLinksByIdT,
  tipsByMoveId: TipsByIdT,
  voteByObjectId: VoteByIdT,
  move: MoveT,
  moveList: MoveListT,
  moveLists: Array<MoveListT>,
  moveTags: Array<TagT>,
  highlightedMoveSlugid: SlugidT,
  // receive any actions as well
};

function _MovePage(props: _MovePagePropsT, bvrs: MoveCrudBvrsT) {
  const actions: any = props;

  const staticTipsPanel = props.move
    ? <StaticTipsPanel
      tips={props.tipsByMoveId[props.move.id]}
      voteByObjectId={props.voteByObjectId}
    />
    : undefined;

  const staticVideoLinksPanel = props.move
    ? <StaticVideoLinksPanel
      videoLinks={props.videoLinksByMoveId[props.move.id]}
      voteByObjectId={props.voteByObjectId}
    />
    : undefined;

  const move = findMoveBySlugid(
    bvrs.insertMoveBvr.preview,
    props.highlightedMoveSlugid
  );

  const moveDiv = move
    ? (props.userProfile && props.userProfile.userId == move.ownerId)
      ? <Move
          move={move}
          userProfile={props.userProfile}
          moveList={props.moveList}
          key={move.id}
          saveMove={bvrs.saveMoveBvr.saveMove}
          cancelEditMove={bvrs.saveMoveBvr.discardChanges}
          moveTags={props.moveTags}
          isEditing={bvrs.isEditing.flag}
          setEditingEnabled={bvrs.isEditing.setTrue}
          tips={props.tipsByMoveId[move.id]}
          videoLinks={props.videoLinksByMoveId[move.id]}
          voteByObjectId={props.voteByObjectId}
          actAddTips={actions.actAddTips}
          actAddVideoLinks={actions.actAddVideoLinks}
          actCastVote={actions.actCastVote}
        />
      : <StaticMove
          move={move}
          moveList={props.moveList}
          key={move.id}
          moveTags={props.moveTags}
          tipsPanel={staticTipsPanel}
          videoLinksPanel={staticVideoLinksPanel}
          videoLinks={props.videoLinksByMoveId[move.id]}
        />
    : <div className="noMoveHighlighted">No move highlighted</div>

  return moveDiv;
}

type MovePagePropsT = _MovePagePropsT & {
  moveSlug: string,
  moveId: ?UUID,
};

export function MovePage(props: MovePagePropsT) {
  const actions: any = props;
  React.useEffect(
    () => {actions.actSetHighlightedMoveBySlug(props.moveSlug, props.moveId)},
    [props.moveSlug, props.moveId]
  );

  return (
    <MoveCrudBvrsContext.Consumer>
      {bvrs => _MovePage(props, bvrs)}
    </MoveCrudBvrsContext.Consumer>
  );
}

// $FlowFixMe
MovePage = connect(
  (state) => ({
    userProfile: fromAppStore.getUserProfile(state.app),
    videoLinksByMoveId: fromStore.getVideoLinksByMoveId(state.moves),
    tipsByMoveId: fromStore.getTipsByMoveId(state.moves),
    moveLists: fromStore.getMoveLists(state.moves),
    moveTags: fromStore.getMoveTags(state.moves),
    moveList: fromStore.getSelectedMoveList(state.moves),
    highlightedMoveSlugid: fromStore.getHighlightedMoveSlugid(state.moves),
    voteByObjectId: fromAppStore.getVoteByObjectId(state.app)
  }),
  {
    ...appActions,
    ...movesActions,
  }
)(MovePage)

export default MovePage;
