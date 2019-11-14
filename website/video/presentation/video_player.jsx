// @flow

import * as React from "react";
import urlParser from "js-video-url-parser";
import { observer } from "mobx-react";
import ReactResizeDetector from "react-resize-detector";
import { debounce } from "debounce";

import { Display } from "screens/session_container/facets/display";
import type { RestartIdT } from "video/types";
import { Video } from "video/bvrs/use_video";
import YoutubePlayer from "video/presentation/youtube_player";
import { VideoControlPanel } from "video/presentation/video_control_panel";
import { listenToIFrame } from "utils/iframe_listener";

type VideoPlayerPropsT = {
  videoBvr: Video,
  restartId: RestartIdT,
  videoWidth: number,
};

export function VideoPlayer(props: VideoPlayerPropsT) {
  const [blackboard, setBlackboard] = React.useState({});
  const video = props.videoBvr.video;
  const link = (video ? video.link : "") || "";
  const videoUrlProps = urlParser.parse(link);

  const internalPlayer =
    videoUrlProps && videoUrlProps.provider == "youtube" ? (
      <YoutubePlayer
        key={link} // yes, we need this
        videoUrlProps={videoUrlProps}
        videoBvr={props.videoBvr}
        restartId={props.restartId}
        videoWidth={props.videoWidth}
        onReady={iframe => {
          listenToIFrame(props.videoBvr.parentDivId, iframe);
        }}
      />
    ) : (
      <React.Fragment />
    );

  return internalPlayer;
}

type VideoPlayerPanelPropsT = {
  videoBvr: Video,
  restartId: RestartIdT,
  display: Display,
};

export const VideoPlayerPanel = observer((props: VideoPlayerPanelPropsT) => {
  const [requestedVideoWidth, setRequestedVideoWidth] = React.useState(0);
  const [videoWidth, setVideoWidth] = React.useState(0);
  const debouncedSetVideoWidth = debounce(setVideoWidth, 500);

  React.useEffect(() => {
    debouncedSetVideoWidth(Math.min(1200, requestedVideoWidth - 10));
  }, [props.display.width, requestedVideoWidth > 0]);

  const controlPanel = <VideoControlPanel videoBvr={props.videoBvr} />;

  const videoPlayer = (
    <VideoPlayer
      videoBvr={props.videoBvr}
      videoWidth={videoWidth}
      restartId={props.restartId}
    />
  );

  return props.videoBvr.video ? (
    <div className={"move__video panel flexcol"}>
      <ReactResizeDetector
        handleWidth
        onResize={x => setRequestedVideoWidth(x)}
      />
      {videoPlayer}
    </div>
  ) : (
    <React.Fragment />
  );
});
