// @flow

import * as React from "react";
import { observer } from "mobx-react";
import ReactResizeDetector from "react-resize-detector";
import { debounce } from "debounce";

import { VideoPlayer } from "video/presentation/video_player";
import { Display } from "screens/session_container/facets/display";
import type { RestartIdT } from "video/types";
import { Video } from "video/bvrs/use_video";
import { VideoControlPanel } from "video/presentation/video_control_panel";

type VideoPlayerPanelPropsT = {
  videoBvr: Video,
  restartId: RestartIdT,
  display: Display,
};

export const VideoPlayerPanel = observer((props: VideoPlayerPanelPropsT) => {
  const [videoWidth, setVideoWidth] = React.useState(100);

  const [requestedVideoWidth, setRequestedVideoWidth] = React.useState(0);
  const debouncedSetRequestedVideoWidth = debounce(
    setRequestedVideoWidth,
    1000,
    true
  );

  React.useEffect(() => {
    setVideoWidth(
      Math.min(props.display.maxVideoWidth, requestedVideoWidth - 10)
    );
  }, [requestedVideoWidth, props.display.fullVideoWidth]);

  const controlPanel = <VideoControlPanel videoBvr={props.videoBvr} />;
  return props.videoBvr.video ? (
    <div className={"move__video panel flexcol"}>
      <ReactResizeDetector
        handleWidth
        onResize={x => debouncedSetRequestedVideoWidth(x)}
      />
      <VideoPlayer
        videoBvr={props.videoBvr}
        videoWidth={videoWidth}
        restartId={props.restartId}
      />
    </div>
  ) : (
    <React.Fragment />
  );
});
