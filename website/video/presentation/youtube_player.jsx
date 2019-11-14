// @flow

import * as React from "react";
import YouTube from "react-youtube";

import type { VideoUrlPropsT, RestartIdT } from "video/types";
import { Video } from "video/bvrs/use_video";
import { runInAction } from "utils/mobx_wrapper";
import { isNone } from "utils/utils";

type YoutubePlayerPropsT = {
  videoUrlProps: VideoUrlPropsT,
  videoBvr: Video,
  restartId: RestartIdT,
  videoWidth: number,
  onReady?: Function,
};

export default function YoutubePlayer(props: YoutubePlayerPropsT) {
  const params = props.videoUrlProps.params;

  const playerVars = {};
  const video = props.videoBvr.video;
  const startTime =
    video && !isNone(video.startTimeMs)
      ? (video.startTimeMs || 0) / 1000
      : params && !isNone(params.start)
      ? params.start
      : null;

  const opts = {
    height: (props.videoWidth * 9) / 16,
    width: props.videoWidth,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1, // yes, we need this
      rel: 0,
    },
  };

  const _onReady = event => {
    const player = event.target;
    runInAction(() => {
      props.videoBvr.player = player;
    });
    if (props.onReady) {
      (props.onReady: any)(player.getIframe());
    }
  };

  const _onPlay = () => {
    runInAction(() => {
      props.videoBvr.isPlaying = true;
    });
  };
  const _onPause = () => {
    runInAction(() => {
      props.videoBvr.isPlaying = false;
    });
  };

  const youtubeRef = React.useRef(null);

  // Seek to start time if there is a new video player or
  // a new video id
  React.useEffect(() => {
    if (youtubeRef.current && !isNone(startTime)) {
      youtubeRef.current.internalPlayer.seekTo(startTime);
    }
  }, [youtubeRef.current, props.restartId]);

  return (
    <YouTube
      ref={youtubeRef}
      videoId={props.videoUrlProps.id}
      opts={opts}
      onReady={_onReady}
      onPlay={_onPlay}
      onPause={_onPause}
    />
  );
}
