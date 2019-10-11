// @flow

import * as React from "react";
import classnames from "classnames";
import { compose } from "redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

import { withFollowMoveListBtn } from "screens/hocs/with_follow_move_list_btn";
import { MoveListTitle } from "move_lists/presentation/move_list_details";
import { VideoPlayer, VideoPlayerPanel } from "video/presentation/video_player";
import { getStore } from "app/store";
import { truncDecimals } from "utils/utils";
import { isOwner } from "app/utils";
import { withHostedMovePanels } from "screens/hocs/with_hosted_own_move_panels";
import { withMoveCrudBvrsContext } from "screens/bvrs/move_crud_behaviours";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";

import type { MoveCrudBvrsT } from "screens/types";
import type { MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import type { TagT } from "tags/types";
import type { UserProfileT } from "profiles/types";
import type { VideoBvrT } from "video/types";

type PropsT = {
  move: MoveT,
  userProfile: UserProfileT,
  moveList: MoveListT,
  moveTags: Array<TagT>,
  hostedMovePanels: any,
  moveCrudBvrs: MoveCrudBvrsT,
  videoBvr: VideoBvrT,
  followMoveListBtn: any,
  // receive any actions as well
};

function getMove() {
  const state = getStore().getState();
  return Ctr.fromStore.getHighlightedMove(state);
}

// $FlowFixMe
export const withMove = compose(
  withMoveCrudBvrsContext,
  withFollowMoveListBtn,
  withHostedMovePanels(getMove),
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    move: Ctr.fromStore.getHighlightedMove(state),
    moveList: Ctr.fromStore.getSelectedMoveList(state),
    moveTags: Ctr.fromStore.getMoveTags(state),
  })),
  (WrappedComponent: any) => (props: any) => {
    const {
      move,
      moveList,
      moveCrudBvrs,
      userProfile,
      moveTags,
      hostedMovePanels,
      followMoveListBtn,
      ...passThroughProps
    }: PropsT = props;

    const isOwnMove =
      !!props.move && isOwner(props.userProfile, props.move.ownerId);
    const moveListTitle = <MoveListTitle moveList={moveList} />;

    const editMoveBtn = (
      <FontAwesomeIcon
        key={"editMoveBtn" + (isOwnMove ? "_own" : "")}
        className={classnames("ml-2 text-lg", { hidden: !isOwnMove })}
        size="lg"
        icon={faEdit}
        onClick={() => moveCrudBvrs.setIsEditing(true)}
      />
    );

    const videoPlayerPanel = (
      <VideoPlayerPanel
        key="videoPlayerPanel"
        videoBvr={props.videoBvr}
        restartId={move ? move.id : ""}
      />
    );

    const space = <div key="space" className={classnames("flex flex-grow")} />;

    const moveDiv = moveCrudBvrs.isEditing ? (
      <div>
        {videoPlayerPanel}
        <Widgets.MoveForm
          autoFocus={true}
          move={move}
          onSubmit={values => {
            moveCrudBvrs.editMoveBvr.finalize(false, values);
          }}
          onCancel={() => moveCrudBvrs.editMoveBvr.finalize(true, null)}
          knownTags={moveTags}
          videoPlayer={props.videoBvr.player}
        />
      </div>
    ) : (
      <div>
        <Widgets.MoveHeader
          move={move}
          moveListTitle={moveListTitle}
          moveTags={moveTags}
          buttons={[editMoveBtn, space, followMoveListBtn]}
        />
        {videoPlayerPanel}
        <Widgets.Move move={move} videoPlayer={props.videoBvr.player} />
        {hostedMovePanels}
      </div>
    );

    return <WrappedComponent moveDiv={moveDiv} {...passThroughProps} />;
  }
);
