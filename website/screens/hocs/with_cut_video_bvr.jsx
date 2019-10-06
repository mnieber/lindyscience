// @flow

import * as React from "react";

import jQuery from "jquery";
import { compose } from "redux";
import KeyboardEventHandler from "react-keyboard-event-handler";

import {
  createKeyDownHandler,
  createVideoKeyHandlers,
} from "screens/presentation/video_keyhandler";
import type { CutPointT, VideoBvrT, VideoT } from "video/types";
import { actAddCutPoints } from "video/actions";
import { useEditCutPoint } from "video/bvrs/cut_point_crud_behaviours";
import { useInterval } from "utils/use_interval";
import { useVideo } from "video/bvrs/use_video";
import { styleTimePoints, extractTimePoints } from "video/utils/cut_points";
import Ctr from "screens/containers/index";

type PropsT = {
  cutVideoLink: string,
  cutPoints: Array<CutPointT>,
  // receive any actions as well
};

// $FlowFixMe
export const withCutVideoBvr = compose(
  Ctr.connect(state => ({
    cutVideoLink: Ctr.fromStore.getCutVideoLink(state),
    cutPoints: Ctr.fromStore.getCutPoints(state),
  })),
  (WrappedComponent: any) => (props: any) => {
    const { cutVideoLink, cutPoints, ...passThroughProps }: PropsT = props;
    const parentDivId = "cutVideoDiv";
    const video: VideoT = {
      link: cutVideoLink,
      startTimeMs: null,
      endTimeMs: null,
    };
    const videoBvr = useVideo(parentDivId, video);

    const editCutPointBvr = useEditCutPoint(cutPoints, videoBvr, cutPoint => {
      props.dispatch(actAddCutPoints([cutPoint]));
    });

    const wrappedComponent = (
      <WrappedComponent
        videoBvr={videoBvr}
        editCutPointBvr={editCutPointBvr}
        {...passThroughProps}
      />
    );

    const videoKeyHandlers = {
      ...createVideoKeyHandlers(videoBvr),
      "ctrl+shift+insert": () => editCutPointBvr.add("start"),
      "ctrl+shift+alt+insert": () => editCutPointBvr.add("end"),
      "ctrl+shift+l": () => {
        jQuery("#linkPanelInput").focus();
      },
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
