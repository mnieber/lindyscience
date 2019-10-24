// @flow

import * as React from "react";
import classnames from "classnames";
import { compose } from "redux";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

import type { UserProfileT } from "profiles/types";
import type { TagT } from "tags/types";
import type { VideoBvrT } from "video/types";
import { MovesContainer } from "screens/data_containers/moves_container";
import { withMovesCtr } from "screens/data_containers/moves_container_context";
import { withFollowMoveListBtn } from "screens/hocs/with_follow_move_list_btn";
import { withHostedMovePanels } from "screens/hocs/with_hosted_move_panels";
import { isOwner } from "app/utils";
import { MoveListTitle } from "move_lists/presentation/move_list_details";
import { VideoPlayerPanel } from "video/presentation/video_player";
import { Editing } from "screens/data_containers/bvrs/editing";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";

type PropsT = {
  userProfile: UserProfileT,
  moveTags: Array<TagT>,
  hostedMovePanels: any,
  videoBvr: VideoBvrT,
  followMoveListBtn: any,
  movesCtr: MovesContainer,
};

// $FlowFixMe
export const withMove = compose(
  withMovesCtr,
  withFollowMoveListBtn,
  withHostedMovePanels,
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    moveTags: Ctr.fromStore.getMoveTags(state),
  })),
  observer,
  (WrappedComponent: any) => (props: any) => {
    const {
      userProfile,
      moveTags,
      hostedMovePanels,
      followMoveListBtn,
      ...passThroughProps
    }: PropsT = props;

    const isEditing = props.movesCtr.editing.isEditing;
    const moveList = props.movesCtr.data.moveList;
    const move = props.movesCtr.highlight.item;

    const isOwnMove = !!move && isOwner(props.userProfile, move.ownerId);
    const moveListTitle = <MoveListTitle moveList={moveList} />;

    const editMoveBtn = (
      <FontAwesomeIcon
        key={"editMoveBtn" + (isOwnMove ? "_own" : "")}
        className={classnames("ml-2 text-lg", { hidden: !isOwnMove })}
        size="lg"
        icon={faEdit}
        onClick={() => Editing.get(props.movesCtr).setIsEditing(true)}
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

    const moveDiv = isEditing ? (
      <div>
        {videoPlayerPanel}
        <Widgets.MoveForm
          autoFocus={true}
          move={move}
          onSubmit={values => Editing.get(props.movesCtr).save(values)}
          onCancel={() => Editing.get(props.movesCtr).cancel()}
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
