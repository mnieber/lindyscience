// @flow

import * as appActions from 'app/actions'
import * as movesActions from 'moves/actions'
import * as React from 'react'
import { connect } from 'react-redux'
import * as fromStore from 'moves/reducers'
import * as fromAppStore from 'app/reducers'
import { findMoveBySlugid, newMoveSlug } from 'moves/utils'
import { Move } from 'moves/presentation/move'
import { TipsPanel } from 'moves/presentation/tips_panel'
import { MoveForm } from 'moves/presentation/move_form'
import { VideoLinksPanel } from 'moves/presentation/videolinks_panel'
import { StaticVideoLinksPanel } from 'moves/presentation/static_videolinks_panel'
import { StaticTipsPanel } from 'moves/presentation/static_tips_panel'
import { MoveCrudBvrsContext } from 'moves/containers/move_crud_behaviours'
import type { UUID, UserProfileT, VoteByIdT, SlugidT } from 'app/types';
import type {
  MoveListT, MoveT, VideoLinksByIdT, TipsByIdT, TagT, MoveCrudBvrsT
} from 'moves/types'


function _createStaticMove(move: MoveT, props: _MovePagePropsT) {
  const tipsPanel =
    <StaticTipsPanel
      tips={props.tipsByMoveId[move.id]}
      voteByObjectId={props.voteByObjectId}
    />

  const videoLinksPanel =
    <StaticVideoLinksPanel
      videoLinks={props.videoLinksByMoveId[move.id]}
      voteByObjectId={props.voteByObjectId}
    />

  return (
    <Move
      move={move}
      moveList={props.moveList}
      key={move.id}
      moveTags={props.moveTags}
      tipsPanel={tipsPanel}
      videoLinksPanel={videoLinksPanel}
      videoLinks={props.videoLinksByMoveId[move.id]}
    />
  )
}

function _createOwnMove(move: MoveT, props: _MovePagePropsT, bvrs: MoveCrudBvrsT) {
  const actions: any = props;

  if (bvrs.isEditing) {
    return (
      <div>
        <MoveForm
          userProfile={props.userProfile}
          autoFocus={true}
          move={move}
          onSubmit={bvrs.saveMoveBvr.saveMove}
          onCancel={bvrs.saveMoveBvr.discardChanges}
          knownTags={props.moveTags}
        />
      </div>
    );
  }
  else {
    const videoLinksPanel = <VideoLinksPanel
      moveId={move.id}
      userProfile={props.userProfile}
      videoLinks={props.videoLinksByMoveId[move.id]}
      voteByObjectId={props.voteByObjectId}
      actAddVideoLinks={actions.actAddVideoLinks}
      actCastVote={actions.actCastVote}
    />;

    const tipsPanel = <TipsPanel
      moveId={move.id}
      userProfile={props.userProfile}
      tips={props.tipsByMoveId[move.id]}
      voteByObjectId={props.voteByObjectId}
      actAddTips={actions.actAddTips}
      actCastVote={actions.actCastVote}
    />;

    const editMoveBtn =
      <div
        className={"move__editBtn button button--wide ml-2"}
        onClick={() => bvrs.setIsEditing(true)}
        key={1}
      >
      Edit move
      </div>;

    return (
      <Move
        move={move}
        userProfile={props.userProfile}
        moveList={props.moveList}
        moveTags={props.moveTags}
        buttons={[editMoveBtn]}
        videoLinksPanel={videoLinksPanel}
        tipsPanel={tipsPanel}
      />
    );
  }
}


type _MovePagePropsT = MovePagePropsT & {
  bvrs: any
};

function _MovePage(props: _MovePagePropsT) {
  React.useEffect(
    () => {
      if (
        props.moveSlug == newMoveSlug &&
        props.userProfile &&
        !props.bvrs.newMoveBvr.newMove
      ) {
        props.bvrs.newMoveBvr.addNewMove();
      }
      props.actions.actSetHighlightedMoveBySlug(props.moveSlug, props.moveId)
    },
    [props.moveSlug, props.moveId, props.userProfile]
  );

  const move = findMoveBySlugid(
    props.bvrs.insertMoveBvr.preview,
    props.highlightedMoveSlugid
  );

  if (!move) {
    return <div className="noMoveHighlighted">Oops, I cannot find this move</div>;
  }

  const isOwnMove = props.userProfile && props.userProfile.userId == move.ownerId;
  return isOwnMove
    ? _createOwnMove(move, props, props.bvrs)
    : _createStaticMove(move, props)
}


type MovePagePropsT = {
  userProfile: UserProfileT,
  videoLinksByMoveId: VideoLinksByIdT,
  tipsByMoveId: TipsByIdT,
  moveLists: Array<MoveListT>,
  moveTags: Array<TagT>,
  moveList: MoveListT,
  highlightedMoveSlugid: SlugidT,
  voteByObjectId: VoteByIdT,
  actions: any,
  moveSlug: string,
  moveId: ?UUID,
};

export function MovePage(props: MovePagePropsT) {
  return (
    <MoveCrudBvrsContext.Consumer>
      {
        bvrs => <_MovePage {...props} bvrs={bvrs} actions={props}/>
      }
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
