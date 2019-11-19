// @flow

import * as React from "react";
import { observer } from "mobx-react";
import ReactResizeDetector from "react-resize-detector";

import { action } from "utils/mobx_wrapper";
import { VideoPlayer } from "video/presentation/video_player";
import { Display } from "screens/session_container/facets/display";
import { Display as MoveDisplay } from "screens/move_container/facets/display";
import { VideoController } from "screens/move_container/facets/video_controller";

type VideoPlayerPanelPropsT = {
  videoCtr: VideoController,
  display: Display,
  moveDisplay: MoveDisplay,
};

export const VideoPlayerPanel = observer((props: VideoPlayerPanelPropsT) => {
  return props.videoCtr.video ? (
    <div className={"move__video panel flexcol"}>
      <ReactResizeDetector
        handleWidth
        onResize={action(x => {
          props.moveDisplay.videoPanelWidth = x;
        })}
      />
      <VideoPlayer
        videoCtr={props.videoCtr}
        videoWidth={props.moveDisplay.videoWidth}
        parentDivId={props.moveDisplay.rootDivId}
      />
    </div>
  ) : (
    <React.Fragment />
  );
});
