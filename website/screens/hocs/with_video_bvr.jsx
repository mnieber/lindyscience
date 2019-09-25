// @flow

import * as React from "react";
import { compose } from "redux";

import { useInterval } from "utils/use_interval";
import { useVideo } from "video/bvrs/video_behaviour";
import { getVideoFromMove } from "moves/utils";
import { useFocus } from "utils/use_focus";
import { setIdOfElementToGiveFocus } from "utils/iframe_mouseover";
import { styleTimePoints, extractTimePoints } from "video/utils/time_points";
import {
  handleVideoKey,
  videoKeys,
} from "screens/presentation/video_keyhandler";
import KeyboardEventHandler from "react-keyboard-event-handler";
import Ctr from "screens/containers/index";

import type { VideoT, VideoBvrT } from "video/types";
import type { MoveT } from "moves/types";

type PropsT = {
  move: MoveT,
  // receive any actions as well
};

// $FlowFixMe
export const withVideoBvr = compose(
  Ctr.connect(
    state => ({
      move: Ctr.fromStore.getHighlightedMove(state),
    }),
    Ctr.actions
  ),
  (WrappedComponent: any) => (props: any) => {
    const { move, ...passThroughProps }: PropsT = props;
    const clientName = "moveVideo";
    const video: ?VideoT = move && move.link ? getVideoFromMove(move) : null;
    const videoBvr = useVideo(clientName, video);
    const description = move ? move.description : "";

    const timePoints = React.useMemo(() => extractTimePoints(description), [
      description,
    ]);

    useInterval(() => styleTimePoints(videoBvr.player, timePoints), 250);
    const actions: any = props;

    const wrappedComponent = (
      <WrappedComponent videoBvr={videoBvr} {...passThroughProps} />
    );

    const onKeyDown = (key, e) => {
      handleVideoKey(
        key,
        e,
        videoBvr,
        move.startTimeMs,
        move.endTimeMs,
        timePoints
      );
    };

    const moveDivRef = React.useRef(null);
    useFocus(moveDivRef.current);

    React.useEffect(() => {
      setIdOfElementToGiveFocus(clientName, moveDiv);
    }, [moveDivRef.current]);

    return (
      <KeyboardEventHandler handleKeys={videoKeys} onKeyEvent={onKeyDown}>
        <div id="moveDiv" tabIndex={123} ref={moveDivRef}>
          {wrappedComponent}
        </div>
      </KeyboardEventHandler>
    );
  }
);
