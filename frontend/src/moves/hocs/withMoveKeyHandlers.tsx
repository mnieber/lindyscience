import * as React from 'react';
import { observer } from 'mobx-react';

import { Display } from 'src/session/facets/Display';
import { TimePoints } from 'src/moves/MoveCtr/facets/TimePoints';
import { MoveT } from 'src/moves/types';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { mergeDefaultProps } from 'src/npm/mergeDefaultProps';
import {
  createVideoKeyHandlers,
  createVideoStartEndKeyHandlers,
  createVideoTimePointKeyHandlers,
} from 'src/video/presentation/VideoKeyhandler';
import { runInAction } from 'src/utils/mobx_wrapper';

type PropsT = {
  defaultProps?: any;
};

type DefaultPropsT = {
  timePoints: TimePoints;
  move: MoveT;
  display: Display;
  videoController: VideoController;
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
