import * as React from 'react';
import { observer } from 'mobx-react';

import { Display } from 'src/session/facets/Display';
import { Display as MoveDisplay } from 'src/moves/MoveCtr/facets/Display';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { mergeDefaultProps } from 'react-default-props-context';
import { VideoPlayerPanel } from 'src/video/presentation/VideoPlayerPanel';

type PropsT = {
  defaultProps?: any;
};

type DefaultPropsT = {
  display: Display;
  moveDisplay: MoveDisplay;
  videoController: VideoController;
};

export const withVideoPlayerPanel = (WrappedComponent: any) =>
  observer((p: PropsT) => {
    const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

    const videoPlayerPanel = (
      <VideoPlayerPanel
        key="videoPlayerPanel"
        videoController={props.videoController}
        display={props.display}
        moveDisplay={props.moveDisplay}
      />
    );

    return <WrappedComponent videoPlayerPanel={videoPlayerPanel} {...p} />;
  });
