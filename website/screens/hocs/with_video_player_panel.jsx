// @flow

import * as React from "react";
import { observer } from "mobx-react";

import { Display } from "screens/session_container/facets/display";
import { Display as MoveDisplay } from "screens/move_container/facets/display";
import { VideoController } from "screens/move_container/facets/video_controller";
import { mergeDefaultProps } from "mergeDefaultProps";
import { VideoPlayerPanel } from "video/presentation/video_player_panel";

type PropsT = {
  defaultProps: any,
};

type DefaultPropsT = {
  display: Display,
  moveDisplay: MoveDisplay,
  videoCtr: VideoController,
};

export const withVideoPlayerPanel = (WrappedComponent: any) =>
  observer((p: PropsT) => {
    const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);

    const videoPlayerPanel = (
      <VideoPlayerPanel
        key="videoPlayerPanel"
        videoCtr={props.videoCtr}
        display={props.display}
        moveDisplay={props.moveDisplay}
      />
    );

    return <WrappedComponent videoPlayerPanel={videoPlayerPanel} {...p} />;
  });
