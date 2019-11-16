// @flow

import * as React from "react";
import YouTube from "react-youtube";

import type { VideoUrlPropsT } from "video/types";
import { VideoController } from "screens/move_container/facets/video_controller";
import { runInAction, action } from "utils/mobx_wrapper";
import { isNone } from "utils/utils";

type YoutubePlayerPropsT = {
  videoUrlProps: VideoUrlPropsT,
  videoCtr: VideoController,
  videoWidth: number,
  setIFrame: Function,
};

export default function YoutubePlayer(props: YoutubePlayerPropsT) {
  const params = props.videoUrlProps.params;

  const playerVars = {};
  const video = props.videoCtr.video;
  const startTime =
    video && !isNone(video.startTimeMs)
      ? (video.startTimeMs || 0) / 1000
      : params && !isNone(params.start)
      ? params.start
      : null;

  const link = props.videoCtr.video ? props.videoCtr.video.link : "";
  React.useEffect(() => {
    if (link) {
      props.videoCtr.pauseAt(startTime || 0);
    }
  }, [link, startTime]);

  const opts = {
    height: (props.videoWidth * 9) / 16,
    width: props.videoWidth,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      rel: 0,
    },
  };

  const _onReady = event => {
    const player = event.target;
    runInAction(() => {
      props.videoCtr.setPlayer(player);
      props.videoCtr.pauseAt(startTime || 0);
    });
    props.setIFrame(player.getIframe());
  };

  const _onPlay = () => {
    runInAction(() => {
      props.videoCtr.isPlaying = true;
    });
  };
  const _onPause = () => {
    runInAction(() => {
      props.videoCtr.isPlaying = false;
    });
  };

  return (
    <YouTube
      videoId={props.videoUrlProps.id}
      opts={opts}
      onReady={_onReady}
      onStateChange={x => {
        const state = x.target.getPlayerState();
        props.videoCtr.setPlayerState(x.data);
      }}
      onPlay={_onPlay}
      onPause={_onPause}
    />
  );
}
