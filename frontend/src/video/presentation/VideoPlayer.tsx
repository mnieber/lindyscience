// @flow

import * as React from 'react';
import urlParser from 'js-video-url-parser';

import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { YoutubePlayer } from 'src/video/presentation/YoutubePlayer';
import { listenToIFrame } from 'src/utils/iframe_listener';

type PropsT = {
  videoController: VideoController,
  videoWidth: number,
  parentDivId: string,
};

export function VideoPlayer(props: PropsT) {
  const video = props.videoController.video;
  const link = (video ? video.link : '') || '';
  const videoUrlProps = urlParser.parse(link);

  const internalPlayer =
    videoUrlProps && videoUrlProps.provider == 'youtube' ? (
      <YoutubePlayer
        key={link} // yes, we need this
        videoUrlProps={videoUrlProps}
        videoController={props.videoController}
        videoWidth={props.videoWidth}
        setIFrame={(iframe) => {
          listenToIFrame(props.parentDivId, iframe);
        }}
      />
    ) : (
      <React.Fragment />
    );

  return internalPlayer;
}
