// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";
import KeyboardEventHandler from "react-keyboard-event-handler";

import { runInAction } from "utils/mobx_wrapper";
import { CutVideoPanel } from "video/presentation/cut_video_panel";
import Ctr from "screens/containers/index";
import { Display } from "screens/session_container/facets/display";
import { Display as MoveDisplay } from "screens/move_container/facets/display";
import { CutPoints } from "screens/cut_video_container/facets/cut_points";
import { mergeDefaultProps, withDefaultProps } from "mergeDefaultProps";
import {
  createKeyDownHandler,
  createVideoKeyHandlers,
} from "screens/presentation/video_keyhandler";
import type { TagT } from "tags/types";

type PropsT = {
  moveTags: Array<TagT>,
  defaultProps: any,
};

type DefaultPropsT = {
  cutPoints: CutPoints,
  display: Display,
  moveDisplay: MoveDisplay,
};

// $FlowFixMe
export const withCutVideoPanel = compose(
  Ctr.connect(state => ({
    moveTags: Ctr.fromStore.getMoveTags(state),
  })),
  withDefaultProps,
  observer,
  (WrappedComponent: any) => (p: PropsT) => {
    const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);

    const videoKeyHandlers = {
      ...createVideoKeyHandlers(props.cutPoints.videoCtr),
      "ctrl+shift+space": () =>
        runInAction(() => {
          props.display.setFullVideoWidth(!props.display.fullVideoWidth);
        }),
      "ctrl+shift+insert": () => props.cutPoints.add("start"),
      "ctrl+shift+alt+insert": () => props.cutPoints.add("end"),
      "ctrl+shift+l": () => {
        jQuery("#linkPanelInput").focus();
      },
    };
    const videoKeys = Object.keys(videoKeyHandlers);
    const onKeyDown = createKeyDownHandler(videoKeyHandlers);
    const cutVideoPanel = (
      <KeyboardEventHandler handleKeys={videoKeys} onKeyEvent={onKeyDown}>
        <div id={props.moveDisplay.rootDivId} tabIndex={123}>
          <CutVideoPanel
            display={props.display}
            moveDisplay={props.moveDisplay}
            moveTags={props.moveTags}
            cutPoints={props.cutPoints}
          />
        </div>
      </KeyboardEventHandler>
    );

    return <WrappedComponent cutVideoPanel={cutVideoPanel} {...p} />;
  }
);
