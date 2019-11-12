// @flow

import * as React from "react";
import urlParser from "js-video-url-parser";
import { observer } from "mobx-react";

import type { RestartIdT, VideoBvrT } from "video/types";
import { Video } from "video/bvrs/use_video";
import YoutubePlayer from "video/presentation/youtube_player";
import { VideoControlPanel } from "video/presentation/video_control_panel";
import { listenToIFrame } from "utils/iframe_listener";

type VideoPlayerPropsT = {
  videoBvr: VideoBvrT,
  restartId: RestartIdT,
};

export function VideoPlayer(props: VideoPlayerPropsT) {
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
};

export const VideoPlayerPanel = observer((props: VideoPlayerPanelPropsT) => {
  const controlPanel = <VideoControlPanel videoBvr={props.videoBvr} />;

  return props.videoBvr.video ? (
    <div className={"move__video panel flexcol"}>
      <VideoPlayer videoBvr={props.videoBvr} restartId={props.restartId} />
    </div>
  ) : (
    <React.Fragment />
  );
});
