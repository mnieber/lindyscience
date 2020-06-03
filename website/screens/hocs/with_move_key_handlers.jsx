// @flow

import * as React from "react";
import { observer } from "mobx-react";

import { Display } from "screens/session_container/facets/display";
import { runInAction } from "utils/mobx_wrapper";
import { TimePoints } from "screens/move_container/facets/time_points";
import { VideoController } from "screens/move_container/facets/video_controller";
import { mergeDefaultProps } from "mergeDefaultProps";
import {
  createVideoKeyHandlers,
  createVideoStartEndKeyHandlers,
  createVideoTimePointKeyHandlers,
} from "screens/presentation/video_keyhandler";
import type { MoveT } from "moves/types";

type PropsT = {
  defaultProps: any,
};

type DefaultPropsT = {
  timePoints: TimePoints,
  move: MoveT,
  display: Display,
  videoCtr: VideoController,
};

export const withMoveKeyHandlers = (WrappedComponent: any) =>
  observer((p: PropsT) => {
    const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);

    const timePoints = props.timePoints.timePoints;
    const move = props.move;

    const moveKeyHandlers = {
      "ctrl+shift+space": () =>
        runInAction(() => {
          props.display.setFullVideoWidth(!props.display.fullVideoWidth);
        }),

      ...createVideoKeyHandlers(props.videoCtr),
      ...createVideoTimePointKeyHandlers(props.videoCtr, timePoints),
      ...(move
        ? createVideoStartEndKeyHandlers(
            props.videoCtr,
            move.startTimeMs ? move.startTimeMs / 1000 : undefined,
            move.endTimeMs ? move.endTimeMs / 1000 : undefined
          )
        : {}),
    };

    return <WrappedComponent moveKeyHandlers={moveKeyHandlers} {...p} />;
  });
