// @flow

import * as React from "react";
import urlParser from "js-video-url-parser";

import { VideoController } from "screens/move_container/facets/video_controller";
import YoutubePlayer from "video/presentation/youtube_player";
import { listenToIFrame } from "utils/iframe_listener";

type VideoPlayerPropsT = {
  videoCtr: VideoController,
  videoWidth: number,
  parentDivId: string,
};

export function VideoPlayer(props: VideoPlayerPropsT) {
  const video = props.videoCtr.video;
  const link = (video ? video.link : "") || "";
  const videoUrlProps = urlParser.parse(link);

  const internalPlayer =
    videoUrlProps && videoUrlProps.provider == "youtube" ? (
      <YoutubePlayer
        key={link} // yes, we need this
        videoUrlProps={videoUrlProps}
        videoCtr={props.videoCtr}
        videoWidth={props.videoWidth}
        setIFrame={iframe => {
          listenToIFrame(props.parentDivId, iframe);
        }}
      />
    ) : (
      <React.Fragment />
    );

  return internalPlayer;
}
