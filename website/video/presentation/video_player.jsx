// @flow

import * as React from "react";
import YoutubePlayer from "video/presentation/youtube_player";
import urlParser from "js-video-url-parser";

import type { VideoT, VideoBvrT } from "video/types";

type VideoPlayerPropsT = {
  video: VideoT,
  videoBvr: VideoBvrT,
};

export function VideoPlayer(props: VideoPlayerPropsT) {
  const link = props.video.link || "";
  const videoUrlProps = urlParser.parse(props.video.link);

  const internalPlayer =
    videoUrlProps.provider == "youtube" ? (
      <YoutubePlayer
        key={props.video.link}
        video={props.video}
        videoUrlProps={videoUrlProps}
        videoBvr={props.videoBvr}
      />
    ) : (
      <React.Fragment />
    );

  return internalPlayer;
}
