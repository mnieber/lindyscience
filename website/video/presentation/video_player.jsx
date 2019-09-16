// @flow

import * as React from "react";
import YoutubePlayer from "video/presentation/youtube_player";
import urlParser from "js-video-url-parser";
import { useVideo } from "video/bvrs/video_behaviour";
import { VideoControlPanel } from "video/presentation/video_control_panel";

import type { VideoT } from "video/types";

type VideoPlayerPropsT = {
  video: VideoT,
};

export function VideoPlayer(props: VideoPlayerPropsT) {
  const link = props.video.link || "";
  const videoUrlProps = urlParser.parse(props.video.link);
  const videoBvr = useVideo();

  const internalPlayer =
    videoUrlProps.provider == "youtube" ? (
      <YoutubePlayer
        key={props.video.link}
        video={props.video}
        videoUrlProps={videoUrlProps}
        videoBvr={videoBvr}
      />
    ) : (
      <React.Fragment />
    );

  const videoControlPanel = <VideoControlPanel videoBvr={videoBvr} />;

  return (
    <div className="flex flex-col">
      {internalPlayer}
      {videoControlPanel}
    </div>
  );
}
