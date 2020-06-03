// @flow

import * as React from 'react';
import { observer } from 'mobx-react';
import ReactResizeDetector from 'react-resize-detector';

import { action } from 'src/utils/mobx_wrapper';
import { VideoPlayer } from 'src/video/presentation/video_player';
import { Display } from 'src/screens/session_container/facets/display';
import { Display as MoveDisplay } from 'src/screens/move_container/facets/display';
import { VideoController } from 'src/screens/move_container/facets/video_controller';

type PropsT = {
  videoController: VideoController,
  display: Display,
  moveDisplay: MoveDisplay,
};

export const VideoPlayerPanel = observer((props: PropsT) => {
  return props.videoController.video ? (
    <div className={'move__video panel flexcol'}>
      <ReactResizeDetector
        handleWidth
        onResize={action((x) => {
          props.moveDisplay.videoPanelWidth = x;
        })}
      />
      <VideoPlayer
        videoController={props.videoController}
        videoWidth={props.moveDisplay.videoWidth}
        parentDivId={props.moveDisplay.rootDivId}
      />
    </div>
  ) : (
    <React.Fragment />
  );
});
