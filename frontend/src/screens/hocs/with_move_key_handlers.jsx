// @flow

import * as React from 'react';
import { observer } from 'mobx-react';

import { Display } from 'src/screens/session_container/facets/display';
import { runInAction } from 'src/utils/mobx_wrapper';
import { TimePoints } from 'src/screens/move_container/facets/time_points';
import { VideoController } from 'src/screens/move_container/facets/video_controller';
import { mergeDefaultProps } from 'src/mergeDefaultProps';
import {
  createVideoKeyHandlers,
  createVideoStartEndKeyHandlers,
  createVideoTimePointKeyHandlers,
} from 'src/screens/presentation/video_keyhandler';
import type { MoveT } from 'src/moves/types';

type PropsT = {
  defaultProps?: any,
};

type DefaultPropsT = {
  timePoints: TimePoints,
  move: MoveT,
  display: Display,
  videoController: VideoController,
};

export const withMoveKeyHandlers = (WrappedComponent: any) =>
  observer((p: PropsT) => {
    const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

    const timePoints = props.timePoints.timePoints;
    const move = props.move;

    const moveKeyHandlers = {
      'ctrl+shift+space': () =>
        runInAction(() => {
          props.display.setFullVideoWidth(!props.display.fullVideoWidth);
        }),

      ...createVideoKeyHandlers(props.videoController),
      ...createVideoTimePointKeyHandlers(props.videoController, timePoints),
      ...(move
        ? createVideoStartEndKeyHandlers(
            props.videoController,
            move.startTimeMs ? move.startTimeMs / 1000 : undefined,
            move.endTimeMs ? move.endTimeMs / 1000 : undefined
          )
        : {}),
    };

    // $FlowFixMe
    return <WrappedComponent moveKeyHandlers={moveKeyHandlers} {...p} />;
  });
