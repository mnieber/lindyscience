// @flow

import * as React from "react";
import YouTube from "react-youtube";
import { isNone } from "utils/utils";

import type { VideoT, VideoUrlPropsT, VideoBvrT } from "video/types";

type YoutubePlayerPropsT = {
  videoUrlProps: VideoUrlPropsT,
  videoBvr: VideoBvrT,
};

export default function YoutubePlayer(props: YoutubePlayerPropsT) {
  const params = props.videoUrlProps.params;

  const playerVars = {};
  const video = props.videoBvr.video;
  const startTime =
    video && !isNone(video.startTimeMs)
      ? (video.startTimeMs || 0) / 1000
      : !isNone(params.start)
      ? params.start
      : null;

  const endTime =
    video && !isNone(video.endTimeMs)
      ? (video.endTimeMs || 0) / 1000
      : !isNone(params.end)
      ? params.end
      : null;

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      rel: 0,
    },
  };

  const _onReady = event => {
    props.videoBvr.setPlayer(event.target);
  };

  const _onEnd = event => {
    const player = event.target;
    player.playVideo();
    player.seekTo(startTime);
  };

  const _onPlay = () => {
    props.videoBvr.setIsPlaying(true);
  };
  const _onPause = () => {
    props.videoBvr.setIsPlaying(false);
  };

  const youtubeRef = React.useRef(null);

  React.useEffect(() => {
    if (youtubeRef.current && !isNone(startTime)) {
      youtubeRef.current.internalPlayer.seekTo(startTime);
    }
  }, [youtubeRef.current, props.videoBvr.video ? props.videoBvr.video.id : ""]);

  return (
    <YouTube
      ref={youtubeRef}
      videoId={props.videoUrlProps.id}
      opts={opts}
      onReady={_onReady}
      onEnd={_onEnd}
      onPlay={_onPlay}
      onPause={_onPause}
    />
  );
}
