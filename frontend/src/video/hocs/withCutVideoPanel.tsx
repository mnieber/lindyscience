// @flow

import { compose } from 'lodash/fp';
import jQuery from 'jquery';
import * as React from 'react';
import { observer } from 'mobx-react';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';
import { Display } from 'src/session/facets/Display';
import { Display as MoveDisplay } from 'src/moves/MoveCtr/facets/Display';
import { CutPoints } from 'src/video/facets/CutPoints';
import { MovesStore } from 'src/moves/MovesStore';
import {
  createKeyDownHandler,
  createVideoKeyHandlers,
} from 'src/video/presentation/VideoKeyhandler';
import { CutVideoPanel } from 'src/video/presentation/CutVideoPanel';
import { runInAction } from 'src/utils/mobx_wrapper';

type PropsT = {
  defaultProps?: any;
};

type DefaultPropsT = {
  cutPoints: CutPoints;
  display: Display;
  moveDisplay: MoveDisplay;
  movesStore: MovesStore;
};

export const withCutVideoPanel: React.FC<PropsT> = compose(
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

    return <WrappedComponent cutVideoPanel={cutVideoPanel} {...p} />;
  }
);
