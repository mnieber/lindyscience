import * as React from 'react';
import { observer } from 'mobx-react';
import ReactResizeDetector from 'react-resize-detector';
import { useDefaultProps, FC } from 'react-default-props-context';

import { Display as SessionDisplay } from 'src/session/facets/Display';
import { Display as MoveDisplay } from 'src/moves/MoveCtr/facets/Display';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { action } from 'mobx';
import { VideoPlayer } from 'src/video/presentation/VideoPlayer';

type PropsT = {};

type DefaultPropsT = {
  sessionDisplay: SessionDisplay;
  moveDisplay: MoveDisplay;
  videoController: VideoController;
};

export const VideoPlayerPanel: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

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
  }
);
