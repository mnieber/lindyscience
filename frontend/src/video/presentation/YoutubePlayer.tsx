import * as React from 'react';
import YouTube from 'react-youtube';

import { VideoUrlPropsT } from 'src/video/types';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { isNone } from 'src/utils/utils';
import { runInAction } from 'src/utils/mobx_wrapper';

type PropsT = {
  videoUrlProps: VideoUrlPropsT;
  videoController: VideoController;
  videoWidth: number;
  setIFrame: Function;
};

export function YoutubePlayer(props: PropsT) {
  const params = props.videoUrlProps.params;

  const video = props.videoController.video;
  const startTime =
    video && !isNone(video.startTimeMs)
      ? (video.startTimeMs || 0) / 1000
      : params && !isNone(params.start)
      ? params.start
      : null;

  const link = props.videoController.video
    ? props.videoController.video.link
    : '';

  const { videoController } = props;

  React.useEffect(() => {
    if (link) {
      videoController.pauseAt(startTime || 0);
    }
  }, [link, startTime, videoController]);

  const opts = {
    height: (props.videoWidth * 9) / 16,
    width: props.videoWidth,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      rel: 0,
    },
  };

  const _onReady = (event: any) => {
    const player = event.target;
    runInAction(() => {
      props.videoController.setPlayer(player);
      props.videoController.pauseAt(startTime || 0);
    });
    props.setIFrame(player.getIframe());
  };

  const _onPlay = () => {
    runInAction(() => {
      props.videoController.isPlaying = true;
    });
  };
  const _onPause = () => {
    runInAction(() => {
      props.videoController.isPlaying = false;
    });
  };

  return (
    <YouTube
      videoId={props.videoUrlProps.id}
      // @ts-ignore
      opts={opts}
      onReady={_onReady}
      onStateChange={(x) => {
        // const state: any = x.target.getPlayerState();
        props.videoController.setPlayerState(x.data);
      }}
      onPlay={_onPlay}
      onPause={_onPause}
    />
  );
}
