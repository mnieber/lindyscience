// @flow

import { compose } from 'rambda';
import jQuery from 'jquery';
import * as React from 'react';
import { observer } from 'mobx-react';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { MovesStore } from 'src/moves/MovesStore';
import { runInAction } from 'src/utils/mobx_wrapper';
import { CutVideoPanel } from 'src/video/presentation/cut_video_panel';
import { Display } from 'src/screens/session_container/facets/display';
import { Display as MoveDisplay } from 'src/screens/move_container/facets/display';
import { CutPoints } from 'src/screens/cut_video_container/facets/cut_points';
import { mergeDefaultProps, withDefaultProps } from 'src/mergeDefaultProps';
import {
  createKeyDownHandler,
  createVideoKeyHandlers,
} from 'src/screens/presentation/video_keyhandler';

type PropsT = {
  defaultProps?: any,
};

type DefaultPropsT = {
  cutPoints: CutPoints,
  display: Display,
  moveDisplay: MoveDisplay,
  movesStore: MovesStore,
};

export const withCutVideoPanel: (PropsT) => any = compose(
  withDefaultProps,
  observer,
  (WrappedComponent: any) => (p: PropsT) => {
    const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

    const videoKeyHandlers = {
      ...createVideoKeyHandlers(props.cutPoints.videoController),
      'ctrl+shift+space': () =>
        runInAction(() => {
          props.display.setFullVideoWidth(!props.display.fullVideoWidth);
        }),
      'ctrl+shift+insert': () => props.cutPoints.add('start'),
      'ctrl+shift+alt+insert': () => props.cutPoints.add('end'),
      'ctrl+shift+l': () => {
        jQuery('#linkPanelInput').focus();
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
            moveTags={Object.keys(props.movesStore.tags)}
            cutPoints={props.cutPoints}
          />
        </div>
      </KeyboardEventHandler>
    );

    // $FlowFixMe
    return <WrappedComponent cutVideoPanel={cutVideoPanel} {...p} />;
  }
);
