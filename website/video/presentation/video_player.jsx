// @flow

import * as React from "react";
import YoutubePlayer from "video/presentation/youtube_player";
import urlParser from "js-video-url-parser";
import { VideoControlPanel } from "video/presentation/video_control_panel";
import { watchIFrameMouseOver } from "utils/iframe_mouseover";

import type { VideoT, VideoBvrT } from "video/types";

type VideoPlayerPropsT = {
  videoBvr: VideoBvrT,
  onReady: Function,
};

export function VideoPlayer(props: VideoPlayerPropsT) {
  const video = props.videoBvr.video;
  const link = video ? video.link || "" : "";
  const videoUrlProps = urlParser.parse(link);

  const internalPlayer =
    videoUrlProps.provider == "youtube" ? (
      <YoutubePlayer
        key={link} // yes, we need this
        videoUrlProps={videoUrlProps}
        videoBvr={props.videoBvr}
        onReady={() => watchIFrameMouseOver(props.videoBvr.clientName)}
      />
    ) : (
      <React.Fragment />
    );

  return internalPlayer;
}

type VideoPlayerPanelPropsT = {
  videoBvr: VideoBvrT,
};

export function VideoPlayerPanel(props: VideoPlayerPanelPropsT) {
  return props.videoBvr.video ? (
    <div className={"move__video panel flex flex-col"}>
      <VideoPlayer videoBvr={props.videoBvr} />
      <VideoControlPanel videoBvr={props.videoBvr} />
    </div>
  ) : (
    <React.Fragment />
  );
}
