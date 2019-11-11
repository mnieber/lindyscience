// @flow

import * as React from "react";
import { compose } from "redux";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { observer } from "mobx-react";

import type { MoveT } from "moves/types";
import { mergeDefaultProps, withDefaultProps } from "screens/default_props";
import type { VideoT } from "video/types";
import {
  createKeyDownHandler,
  createVideoKeyHandlers,
  createVideoStartEndKeyHandlers,
  createVideoTimePointKeyHandlers,
} from "screens/presentation/video_keyhandler";
import { useInterval } from "utils/use_interval";
import { useVideo } from "video/bvrs/use_video";
import { getVideoFromMove } from "moves/utils";
import { styleTimePoints, extractTimePoints } from "video/utils";
import Ctr from "screens/containers/index";

type PropsT = {
  defaultProps: any,
} & {
  // default props
  move: MoveT,
};

// $FlowFixMe
export const withMoveVideoBvr = compose(
  Ctr.connect(state => ({})),
  withDefaultProps,
  observer,
  (WrappedComponent: any) => (p: any) => {
    const props = mergeDefaultProps(p);

    const { ...passThroughProps }: PropsT = props;

    const parentDivId = "moveDiv";
    const videoBvr = useVideo(parentDivId);
    videoBvr.video =
      props.move && props.move.link ? getVideoFromMove(props.move) : null;

    const description = props.move ? props.move.description : "";
    const privateNotes =
      props.move && props.move.privateData ? props.move.privateData.notes : "";
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
      ...(props.move
        ? createVideoStartEndKeyHandlers(
            videoBvr,
            props.move.startTimeMs ? props.move.startTimeMs / 1000 : undefined,
            props.move.endTimeMs ? props.move.endTimeMs / 1000 : undefined
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
