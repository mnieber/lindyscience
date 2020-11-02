import * as React from 'react';
import { observer } from 'mobx-react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { keys } from 'lodash/fp';

import { Display as SessionDisplay } from 'src/session/facets/Display';
import { TimePoints } from 'src/moves/MoveCtr/facets/TimePoints';
import { MoveT } from 'src/moves/types';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { useDefaultProps, FC } from 'react-default-props-context';
import {
  createVideoKeyHandlers,
  createVideoStartEndKeyHandlers,
  createVideoTimePointKeyHandlers,
} from 'src/video/presentation/VideoKeyhandler';
import { runInAction } from 'src/utils/mobx_wrapper';
import { createKeyDownHandler } from 'src/video/presentation/VideoKeyhandler';

type PropsT = React.PropsWithChildren<{}>;

type DefaultPropsT = {
  timePoints: TimePoints;
  move: MoveT;
  sessionDisplay: SessionDisplay;
  videoController: VideoController;
};

export const MoveKeyHandlers: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    const timePoints = props.timePoints.timePoints;
    const move = props.move;

    const moveKeyHandlers = {
      'ctrl+shift+space': () =>
        runInAction(() => {
          props.sessionDisplay.setFullVideoWidth(
            !props.sessionDisplay.fullVideoWidth
          );
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

    const videoKeys = keys(moveKeyHandlers);
    const onKeyDown = createKeyDownHandler(moveKeyHandlers);

    return (
      <KeyboardEventHandler handleKeys={videoKeys} onKeyEvent={onKeyDown}>
        {props.children}
      </KeyboardEventHandler>
    );
  }
);
