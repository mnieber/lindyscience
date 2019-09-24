// @flow

import * as React from "react";
import { compose } from "redux";
import jQuery from "jquery";

import { useInterval } from "utils/use_interval";
import { useVideo } from "video/bvrs/video_behaviour";
import { timePointRegex } from "video/utils";
import { getVideoFromMove } from "moves/utils";
import { isNone, parseVideoTimePoint } from "utils/utils";
import { useFocus } from "utils/use_focus";
import { setIdOfElementToGiveFocus } from "utils/iframe_mouseover";

import {
  handleVideoKey,
  videoKeys,
} from "screens/presentation/video_keyhandler";
import KeyboardEventHandler from "react-keyboard-event-handler";
import Ctr from "screens/containers/index";

import type { VideoT, VideoBvrT } from "video/types";
import type { MoveT } from "moves/types";

function _styleTimePoints(videoPlayer: any, timePoints: Array<number>) {
  const currentTime = videoPlayer ? videoPlayer.getCurrentTime() : -1;

  timePoints.forEach(tp => {
    const className = ".tp-" + tp;
    jQuery(className).removeClass("bg-yellow");
    if (currentTime - 1 < tp && tp < currentTime + 1) {
      jQuery(className).addClass("bg-yellow");
    }
  });
}

function _extractTimePoints(text: string): Array<number> {
  const result = [];
  const r = timePointRegex();
  let matchArr;
  while ((matchArr = r.exec(text)) !== null) {
    // $FlowFixMe
    const tpString = matchArr[1];
    const tp = parseVideoTimePoint(tpString);
    if (tp !== null) {
      result.push(tp);
    }
  }
  return result;
}

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

    const video: ?VideoT = move && move.link ? getVideoFromMove(move) : null;
    const videoBvr = useVideo(video);
    const description = move ? move.description : "";

    const timePoints = React.useMemo(() => _extractTimePoints(description), [
      description,
    ]);

    useInterval(() => _styleTimePoints(videoBvr.player, timePoints), 250);
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
      setIdOfElementToGiveFocus("moveDiv");
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
