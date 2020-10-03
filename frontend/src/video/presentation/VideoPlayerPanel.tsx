import * as React from 'react';
import { observer } from 'mobx-react';
import ReactResizeDetector from 'react-resize-detector';

import { Display } from 'src/session/facets/Display';
import { Display as MoveDisplay } from 'src/moves/MoveCtr/facets/Display';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { action } from 'src/utils/mobx_wrapper';
import { VideoPlayer } from 'src/video/presentation/VideoPlayer';

type PropsT = {
  videoController: VideoController;
  display: Display;
  moveDisplay: MoveDisplay;
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
        videoWidth={props.moveDisplay.videoWidth ?? 0}
        parentDivId={props.moveDisplay.rootDivId ?? ''}
      />
    </div>
  ) : (
    <React.Fragment />
  );
});
