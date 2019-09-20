// @flow

import * as React from "react";
import YoutubePlayer from "video/presentation/youtube_player";
import urlParser from "js-video-url-parser";

import type { VideoT, VideoBvrT } from "video/types";

type VideoPlayerPropsT = {
  videoBvr: VideoBvrT,
};

export function VideoPlayer(props: VideoPlayerPropsT) {
  const video = props.videoBvr.video;
  const link = video ? video.link || "" : "";
  const videoUrlProps = urlParser.parse(link);

  const internalPlayer =
    videoUrlProps.provider == "youtube" ? (
      <YoutubePlayer
        key={link}
        videoUrlProps={videoUrlProps}
        videoBvr={props.videoBvr}
      />
    ) : (
      <React.Fragment />
    );

  return internalPlayer;
}
