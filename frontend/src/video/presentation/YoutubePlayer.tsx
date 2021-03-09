import * as React from 'react';
import YouTube from 'react-youtube';

import { VideoUrlPropsT } from 'src/video/types';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { isNone } from 'src/utils/utils';
import { runInAction } from 'mobx';

type PropsT = {
  videoUrlProps: VideoUrlPropsT;
  videoController: VideoController;
  videoWidth: number;
  setIFrame: Function;
};

export function YoutubePlayer(props: PropsT) {
  const params = props.videoUrlProps.params;
  const { videoController } = props;
  const video = videoController.video;
  const link = video ? video.link : '';

  const startTime =
    video && !isNone(video.startTimeMs)
      ? (video.startTimeMs || 0) / 1000
      : params && !isNone(params.start)
      ? params.start
      : null;

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
      setTimeout(() => {
        videoController.setPlayer(player);
        videoController.pauseAt(startTime || 0);
      }, 100);
    });
    props.setIFrame(player.getIframe());
  };

  const _onPlay = () => {
    runInAction(() => {
      videoController.isPlaying = true;
    });
  };
  const _onPause = () => {
    runInAction(() => {
      videoController.isPlaying = false;
    });
  };

  return (
    <YouTube
      videoId={props.videoUrlProps.id}
      // @ts-ignore
      opts={opts}
      onReady={_onReady}
      onStateChange={(x) => videoController.setPlayerState(x.data)}
      onPlay={_onPlay}
      onPause={_onPause}
    />
  );
}
