// @flow

import * as React from "react";
import { compose } from "redux";

import { useInterval } from "utils/use_interval";
import { useVideo } from "video/bvrs/use_video";
import { styleTimePoints, extractTimePoints } from "video/utils/cut_points";
import {
  handleVideoKey,
  videoKeys,
} from "screens/presentation/video_keyhandler";
import KeyboardEventHandler from "react-keyboard-event-handler";
import Ctr from "screens/containers/index";

import type { VideoT, VideoBvrT } from "video/types";

type PropsT = {
  cutVideoLink: string,
  // receive any actions as well
};

// $FlowFixMe
export const withCutVideoBvr = compose(
  Ctr.connect(
    state => ({
      cutVideoLink: Ctr.fromStore.getCutVideoLink(state),
    }),
    Ctr.actions
  ),
  (WrappedComponent: any) => (props: any) => {
    const { cutVideoLink, ...passThroughProps }: PropsT = props;
    const parentDivId = "cutVideoDiv";
    const video: VideoT = {
      link: cutVideoLink,
      startTimeMs: null,
      endTimeMs: null,
    };
    const videoBvr = useVideo(parentDivId, video);

    const wrappedComponent = (
      <WrappedComponent videoBvr={videoBvr} {...passThroughProps} />
    );

    const onKeyDown = (key, e) => {
      handleVideoKey(key, e, videoBvr, 0, 0, []);
    };

    return (
      <KeyboardEventHandler handleKeys={videoKeys} onKeyEvent={onKeyDown}>
        <div id={parentDivId} tabIndex={123}>
          {wrappedComponent}
        </div>
      </KeyboardEventHandler>
    );
  }
);
