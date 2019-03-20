// @flow

import * as React from "react";
import { compose } from "redux";
import MovesCtr from "moves/containers/index";
import AppCtr from "app/containers/index";

import Widgets from "moves/presentation/index";
import { withMovePrivateDataPanel } from "moves/containers/with_move_private_data_panel";
import { withVideoLinksPanel } from "moves/containers/with_videolinks_panel";
import { withTipsPanel } from "moves/containers/with_tips_panel";

// $FlowFixMe
import uuidv4 from "uuid/v4";
import { newMoveSlug } from "moves/utils";
import { isOwner } from "app/utils";

import { MoveCrudBvrsContext } from "moves/containers/move_crud_behaviours";

import type { UUID, UserProfileT, VoteByIdT, TagT, VoteT } from "app/types";
import type {
  MoveListT,
  MoveT,
  VideoLinksByIdT,
  TipsByIdT,
  MoveCrudBvrsT,
} from "moves/types";

type MovePagePropsT = {
  movePrivateDataPanel: any,
  tipsPanel: any,
  videoLinksPanel: any,
  videoLinksByMoveId: VideoLinksByIdT,
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

function StaticMove(props: _MovePagePropsT) {
  const actions: any = props;
  const move = props.highlightedMove;

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
      movePrivateDataPanel={props.movePrivateDataPanel}
    />
  );
}

function OwnMove(props: _MovePagePropsT) {
  const actions: any = props;
  const move = props.highlightedMove;

  if (props.moveCrudBvrs.isEditing) {
    return (
      <div>
        <Widgets.MoveForm
          userProfile={props.userProfile}
          autoFocus={true}
          move={move}
          onSubmit={props.moveCrudBvrs.saveMoveBvr.saveItem}
          onCancel={props.moveCrudBvrs.saveMoveBvr.discardChanges}
          knownTags={props.moveTags}
        />
      </div>
    );
  } else {
    const editMoveBtn = (
      <div
        className={"move__editBtn button button--wide ml-2"}
        onClick={() => props.moveCrudBvrs.setIsEditing(true)}
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
        videoLinksPanel={props.videoLinksPanel}
        tipsPanel={props.tipsPanel}
        movePrivateDataPanel={props.movePrivateDataPanel}
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
    ? OwnMove(props)
    : StaticMove(props);
}

export function MovePage(props: MovePagePropsT) {
  return (
    <MoveCrudBvrsContext.Consumer>
      {moveCrudBvrs => <_MovePage {...props} moveCrudBvrs={moveCrudBvrs} />}
    </MoveCrudBvrsContext.Consumer>
  );
}

// $FlowFixMe
MovePage = compose(
  withTipsPanel,
  withVideoLinksPanel,
  withMovePrivateDataPanel,
  MovesCtr.connect(
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
  )
)(MovePage);

export default MovePage;
