// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";

import { getId } from "app/utils";
import { getStore } from "app/store";

import Widgets from "screens/presentation/index";
import { MoveListTitle } from "move_lists/presentation/move_list_details";
import { withHostedStaticMovePanels } from "screens/hocs/with_hosted_static_move_panels";
import { VideoControlPanel } from "video/presentation/video_control_panel";
import { VideoPlayer, VideoPlayerPanel } from "video/presentation/video_player";
import { useVideo } from "video/bvrs/use_video";
import { getVideoFromMove } from "moves/utils";

import type { MoveT } from "moves/types";
import type { MoveListT } from "move_lists/types";
import type { TagT } from "tags/types";
import type { VideoT, VideoBvrT } from "video/types";

type PropsT = {
  move: MoveT,
  moveList: MoveListT,
  moveTags: Array<TagT>,
  hostedStaticMovePanels: any,
  videoBvr: VideoBvrT,
  // receive any actions as well
};

function getMove() {
  const state = getStore().getState();
  return Ctr.fromStore.getHighlightedMove(state);
}

// $FlowFixMe
export const withStaticMove = compose(
  withHostedStaticMovePanels(getMove),
  Ctr.connect(
    state => ({
      move: Ctr.fromStore.getHighlightedMove(state),
      moveList: Ctr.fromStore.getSelectedMoveList(state),
      moveTags: Ctr.fromStore.getMoveTags(state),
    }),
    Ctr.actions
  ),
  (WrappedComponent: any) => (props: any) => {
    const {
      move,
      moveList,
      moveTags,
      hostedStaticMovePanels,
      ...passThroughProps
    }: PropsT = props;

    const actions: any = props;

    const moveListTitle = <MoveListTitle moveList={moveList} />;

    const setIsEditing = () => {};
    const videoPlayerPanel = (
      <VideoPlayerPanel videoBvr={props.videoBvr} setIsEditing={setIsEditing} />
    );

    const staticMove = (
      <div>
        <Widgets.MoveHeader
          move={move}
          moveListTitle={moveListTitle}
          moveTags={moveTags}
        />
        {videoPlayerPanel}
        <Widgets.Move move={move} videoPlayer={props.videoBvr.player} />
        {hostedStaticMovePanels}
      </div>
    );

    return <WrappedComponent staticMove={staticMove} {...passThroughProps} />;
  }
);
