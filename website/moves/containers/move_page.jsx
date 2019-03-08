// @flow

import * as React from 'react'
import MovesCtr from 'moves/containers/index'
import AppCtr from 'app/containers/index'

import Widgets from 'moves/presentation/index'

// $FlowFixMe
import uuidv4 from 'uuid/v4'
import { findMoveBySlugid, newMoveSlug } from 'moves/utils'
import { isOwner, createErrorHandler } from 'app/utils'

import { MoveCrudBvrsContext } from 'moves/containers/move_crud_behaviours'

import type { UUID, UserProfileT, VoteByIdT, SlugidT, TagT } from 'app/types';
import type {
  MoveListT, MoveT, VideoLinksByIdT, TipsByIdT, MoveCrudBvrsT, MovePrivateDataT,
} from 'moves/types'


function _createMovePrivateDataPanel(move: MoveT, actions: any) {
  const _onSave = values => {
    const movePrivateData = {
      'id': uuidv4(),
      'moveId': move.id,
      ...move.privateData,
      ...values
    };

    actions.actAddMovePrivateDatas([movePrivateData]);
    MovesCtr.api.saveMovePrivateData(movePrivateData)
      .catch(createErrorHandler("We could not update your private data for this move"));
  };

  return (
    <Widgets.MovePrivateDataPanel
      movePrivateData={move.privateData}
      onSave={_onSave}
    />
  );
}


type MovePagePropsT = {
  userProfile: UserProfileT,
  videoLinksByMoveId: VideoLinksByIdT,
  tipsByMoveId: TipsByIdT,
  moveTags: Array<TagT>,
  moveList: MoveListT,
  highlightedMoveSlugid: SlugidT,
  voteByObjectId: VoteByIdT,
  actions: any,
  moveSlug: string,
  moveId: ?UUID,
};

type _MovePagePropsT = MovePagePropsT & {
  moveCrudBvrs: MoveCrudBvrsT
};

function _createStaticMove(move: MoveT, props: _MovePagePropsT, actions: any) {
  const tipsPanel =
    <Widgets.StaticTipsPanel
      tips={props.tipsByMoveId[move.id]}
      voteByObjectId={props.voteByObjectId}
    />

  const videoLinksPanel =
    <Widgets.StaticVideoLinksPanel
      videoLinks={props.videoLinksByMoveId[move.id]}
      voteByObjectId={props.voteByObjectId}
    />

  return (
    <Widgets.Move
      move={move}
      moveList={props.moveList}
      key={move.id}
      moveTags={props.moveTags}
      tipsPanel={tipsPanel}
      videoLinksPanel={videoLinksPanel}
      videoLinks={props.videoLinksByMoveId[move.id]}
      movePrivateDataPanel={_createMovePrivateDataPanel(move, actions)}
    />
  )
}

function _createOwnMove(
  move: MoveT, props: _MovePagePropsT, bvrs: MoveCrudBvrsT, actions: any
) {
  if (bvrs.isEditing) {
    return (
      <div>
        <Widgets.MoveForm
          userProfile={props.userProfile}
          autoFocus={true}
          move={move}
          onSubmit={bvrs.saveMoveBvr.saveItem}
          onCancel={bvrs.saveMoveBvr.discardChanges}
          knownTags={props.moveTags}
        />
      </div>
    );
  }
  else {
    const videoLinksPanel = <Widgets.VideoLinksPanel
      moveId={move.id}
      userProfile={props.userProfile}
      videoLinks={props.videoLinksByMoveId[move.id]}
      voteByObjectId={props.voteByObjectId}
      actAddVideoLinks={actions.actAddVideoLinks}
      actCastVote={actions.actCastVote}
    />;

    const tipsPanel = <Widgets.TipsPanel
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
      <Widgets.Move
        move={move}
        userProfile={props.userProfile}
        moveList={props.moveList}
        moveTags={props.moveTags}
        buttons={[editMoveBtn]}
        videoLinksPanel={videoLinksPanel}
        tipsPanel={tipsPanel}
        movePrivateDataPanel={_createMovePrivateDataPanel(move, actions)}
      />
    );
  }
}


function _MovePage(props: _MovePagePropsT) {
  const actions: any = props;

  React.useEffect(
    () => {
      if (
        props.userProfile &&
        props.moveSlug == newMoveSlug &&
        !props.moveCrudBvrs.newMoveBvr.newItem
      ) {
        props.moveCrudBvrs.newMoveBvr.addNewItem();
      }
      actions.actSetHighlightedMoveBySlug(props.moveSlug, props.moveId)
    },
    [props.moveSlug, props.moveId, props.userProfile]
  );

  const move = findMoveBySlugid(
    props.moveCrudBvrs.insertMoveBvr.preview,
    props.highlightedMoveSlugid
  );

  if (!move) {
    return <div className="noMoveHighlighted">Oops, I cannot find this move</div>;
  }

  return isOwner(props.userProfile, move.ownerId)
    ? _createOwnMove(move, props, props.moveCrudBvrs, actions)
    : _createStaticMove(move, props, actions)
}


export function MovePage(props: MovePagePropsT) {
  return (
    <MoveCrudBvrsContext.Consumer>{moveCrudBvrs =>
      <_MovePage
        {...props}
        moveCrudBvrs={moveCrudBvrs}
      />
    }</MoveCrudBvrsContext.Consumer>
  );
}

// $FlowFixMe
MovePage = MovesCtr.connect(
  (state) => ({
    userProfile: AppCtr.fromStore.getUserProfile(state.app),
    videoLinksByMoveId: MovesCtr.fromStore.getVideoLinksByMoveId(state.moves),
    tipsByMoveId: MovesCtr.fromStore.getTipsByMoveId(state.moves),
    moveTags: MovesCtr.fromStore.getMoveTags(state.moves),
    moveList: MovesCtr.fromStore.getSelectedMoveList(state.moves),
    highlightedMoveSlugid: MovesCtr.fromStore.getHighlightedMoveSlugid(state.moves),
    voteByObjectId: AppCtr.fromStore.getVoteByObjectId(state.app)
  }),
  {
    ...AppCtr.actions,
    ...MovesCtr.actions,
  }
)(MovePage)

export default MovePage;
