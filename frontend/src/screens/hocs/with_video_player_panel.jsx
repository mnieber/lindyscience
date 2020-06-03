// @flow

import * as React from 'react';
import { observer } from 'mobx-react';

import { Display } from 'src/screens/session_container/facets/display';
import { Display as MoveDisplay } from 'src/screens/move_container/facets/display';
import { VideoController } from 'src/screens/move_container/facets/video_controller';
import { mergeDefaultProps } from 'src/mergeDefaultProps';
import { VideoPlayerPanel } from 'src/video/presentation/video_player_panel';

type PropsT = {
  defaultProps?: any,
};

type DefaultPropsT = {
  display: Display,
  moveDisplay: MoveDisplay,
  videoController: VideoController,
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

    // $FlowFixMe
    return <WrappedComponent videoPlayerPanel={videoPlayerPanel} {...p} />;
  });
