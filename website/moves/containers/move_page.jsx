// @flow

import * as React from "react";
import MovesCtr from "moves/containers/index";
import AppCtr from "app/containers/index";

import Widgets from "moves/presentation/index";

// $FlowFixMe
import uuidv4 from "uuid/v4";
import { newMoveSlug } from "moves/utils";
import { isOwner, createErrorHandler } from "app/utils";
import { querySetListToDict } from "utils/utils";

import { MoveCrudBvrsContext } from "moves/containers/move_crud_behaviours";

import type { UUID, UserProfileT, VoteByIdT, TagT, VoteT } from "app/types";
import type {
  MoveListT,
  MoveT,
  VideoLinkT,
  VideoLinksByIdT,
  TipT,
  TipsByIdT,
  MoveCrudBvrsT,
  MovePrivateDataT,
} from "moves/types";

function _createMovePrivateDataPanel(move: MoveT, actions: any) {
  const _onSave = values => {
    const movePrivateData = {
      id: uuidv4(),
      moveId: move.id,
      ...move.privateData,
      ...values,
    };

    actions.actAddMovePrivateDatas([movePrivateData]);
    MovesCtr.api
      .saveMovePrivateData(movePrivateData)
      .catch(
        createErrorHandler(
          "We could not update your private data for this move"
        )
      );
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
  highlightedMove: MoveT,
  voteByObjectId: VoteByIdT,
  actions: any,
  // the follower are inserted by the router
  moveSlug: string,
  moveId: ?UUID,
};

type _MovePagePropsT = MovePagePropsT & {
  moveCrudBvrs: MoveCrudBvrsT,
};

function _createStaticMove(move: MoveT, props: _MovePagePropsT, actions: any) {
  const tipsPanel = (
    <Widgets.StaticTipsPanel
      tips={props.tipsByMoveId[move.id]}
      voteByObjectId={props.voteByObjectId}
    />
  );

  const videoLinksPanel = (
    <Widgets.StaticVideoLinksPanel
      videoLinks={props.videoLinksByMoveId[move.id]}
      voteByObjectId={props.voteByObjectId}
    />
  );

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
  );
}

function _createOwnMove(
  move: MoveT,
  props: _MovePagePropsT,
  bvrs: MoveCrudBvrsT,
  actions: any
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
  } else {
    const saveVideoLink = (videoLink: VideoLinkT) => {
      actions.actAddVideoLinks(querySetListToDict([videoLink]));
      let response = MovesCtr.api.saveVideoLink(move.id, videoLink);
      response.catch(createErrorHandler("We could not save the video link"));
    };

    const voteVideoLink = (id: UUID, vote: VoteT) => {
      actions.actCastVote(id, vote);
      AppCtr.api
        .voteVideoLink(id, vote)
        .catch(createErrorHandler("We could not save your vote"));
    };

    const videoLinksPanel = (
      <Widgets.VideoLinksPanel
        moveId={move.id}
        userProfile={props.userProfile}
        videoLinks={props.videoLinksByMoveId[move.id]}
        voteByObjectId={props.voteByObjectId}
        saveVideoLink={saveVideoLink}
        voteVideoLink={voteVideoLink}
      />
    );

    const saveTip = (tip: TipT) => {
      actions.actAddTips(querySetListToDict([tip]));
      let response = MovesCtr.api.saveTip(move.id, tip);
      response.catch(createErrorHandler("We could not save the tip"));
    };

    const voteTip = (id: UUID, vote: VoteT) => {
      actions.actCastVote(id, vote);
      AppCtr.api
        .voteTip(id, vote)
        .catch(createErrorHandler("We could not save your vote"));
    };

    const tipsPanel = (
      <Widgets.TipsPanel
        moveId={move.id}
        userProfile={props.userProfile}
        tips={props.tipsByMoveId[move.id]}
        voteByObjectId={props.voteByObjectId}
        saveTip={saveTip}
        voteTip={voteTip}
      />
    );

    const editMoveBtn = (
      <div
        className={"move__editBtn button button--wide ml-2"}
        onClick={() => bvrs.setIsEditing(true)}
        key={1}
      >
        Edit move
      </div>
    );

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

  React.useEffect(() => {
    if (
      props.userProfile &&
      props.moveSlug == newMoveSlug &&
      !props.moveCrudBvrs.newMoveBvr.newItem
    ) {
      props.moveCrudBvrs.newMoveBvr.addNewItem();
    }
    actions.actSetHighlightedMoveBySlug(props.moveSlug, props.moveId);
  }, [props.moveSlug, props.moveId, props.userProfile]);

  if (!props.highlightedMove) {
    return (
      <div className="noMoveHighlighted">Oops, I cannot find this move</div>
    );
  }

  return isOwner(props.userProfile, props.highlightedMove.ownerId)
    ? _createOwnMove(props.highlightedMove, props, props.moveCrudBvrs, actions)
    : _createStaticMove(props.highlightedMove, props, actions);
}

export function MovePage(props: MovePagePropsT) {
  return (
    <MoveCrudBvrsContext.Consumer>
      {moveCrudBvrs => <_MovePage {...props} moveCrudBvrs={moveCrudBvrs} />}
    </MoveCrudBvrsContext.Consumer>
  );
}

// $FlowFixMe
MovePage = MovesCtr.connect(
  state => ({
    userProfile: AppCtr.fromStore.getUserProfile(state),
    videoLinksByMoveId: MovesCtr.fromStore.getVideoLinksByMoveId(state),
    tipsByMoveId: MovesCtr.fromStore.getTipsByMoveId(state),
    moveTags: MovesCtr.fromStore.getMoveTags(state),
    moveList: MovesCtr.fromStore.getSelectedMoveList(state),
    highlightedMove: MovesCtr.fromStore.getHighlightedMove(state),
    voteByObjectId: AppCtr.fromStore.getVoteByObjectId(state),
  }),
  {
    ...AppCtr.actions,
    ...MovesCtr.actions,
  }
)(MovePage);

export default MovePage;
