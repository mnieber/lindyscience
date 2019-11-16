// @flow

import * as React from "react";
import urlParser from "js-video-url-parser";

import type { RestartIdT } from "video/types";
import { Video } from "video/bvrs/use_video";
import YoutubePlayer from "video/presentation/youtube_player";
import { listenToIFrame } from "utils/iframe_listener";

type VideoPlayerPropsT = {
  videoBvr: Video,
  restartId: RestartIdT,
  videoWidth: number,
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
