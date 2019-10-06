// @flow

import * as React from "react";
import { compose } from "redux";
import KeyboardEventHandler from "react-keyboard-event-handler";

import {
  createKeyDownHandler,
  createVideoKeyHandlers,
  createVideoStartEndKeyHandlers,
  createVideoTimePointKeyHandlers,
} from "screens/presentation/video_keyhandler";
import { useInterval } from "utils/use_interval";
import { useVideo } from "video/bvrs/use_video";
import { getVideoFromMove } from "moves/utils";
import { styleTimePoints, extractTimePoints } from "video/utils/cut_points";
import Ctr from "screens/containers/index";
import type { VideoT, VideoBvrT } from "video/types";
import type { MoveT } from "moves/types";

type PropsT = {
  move: MoveT,
  // receive any actions as well
};

// $FlowFixMe
export const withMoveVideoBvr = compose(
  Ctr.connect(state => ({
    move: Ctr.fromStore.getHighlightedMove(state),
  })),
  (WrappedComponent: any) => (props: any) => {
    const { move, ...passThroughProps }: PropsT = props;
    const parentDivId = "moveDiv";
    const video: ?VideoT = move && move.link ? getVideoFromMove(move) : null;
    const videoBvr = useVideo(parentDivId, video);

    const description = move ? move.description : "";
    const privateNotes = move && move.privateData ? move.privateData.notes : "";
    const textWithTimePoints = description + privateNotes;

    const timePoints = React.useMemo(
      () => extractTimePoints(textWithTimePoints),
      [textWithTimePoints]
    );

    useInterval(() => styleTimePoints(videoBvr.player, timePoints), 250);

    const wrappedComponent = (
      <WrappedComponent videoBvr={videoBvr} {...passThroughProps} />
    );

    const videoKeyHandlers = {
      ...createVideoKeyHandlers(videoBvr),
      ...createVideoTimePointKeyHandlers(videoBvr, timePoints),
      ...(move
        ? createVideoStartEndKeyHandlers(
            videoBvr,
            move.startTimeMs ? move.startTimeMs / 1000 : undefined,
            move.endTimeMs ? move.endTimeMs / 1000 : undefined
          )
        : {}),
    };
    const videoKeys = Object.keys(videoKeyHandlers);
    const onKeyDown = createKeyDownHandler(videoKeyHandlers);

    return (
      <KeyboardEventHandler handleKeys={videoKeys} onKeyEvent={onKeyDown}>
        <div id={parentDivId} tabIndex={123}>
          {wrappedComponent}
        </div>
      </KeyboardEventHandler>
    );
  }
);
