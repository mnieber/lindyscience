import jQuery from 'jquery';
import { keys } from 'lodash/fp';
import * as React from 'react';
import { observer } from 'mobx-react';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { Addition } from 'skandha-facets/Addition';
import { useDefaultProps } from 'react-default-props-context';
import { Display as SessionDisplay } from 'src/app/Display';
import { Display as MoveDisplay } from 'src/moves/MoveCtr/facets/Display';
import {
  createKeyDownHandler,
  createVideoKeyHandlers,
} from 'src/video/components/VideoKeyhandler';
import { runInAction } from 'mobx';

type PropsT = React.PropsWithChildren<{}>;

type DefaultPropsT = {
  cutPointsAddition: Addition;
  sessionDisplay: SessionDisplay;
  moveDisplay: MoveDisplay;
  videoController: VideoController;
};

export const CutVideoKeyHandler = observer((p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

  const videoKeyHandlers = {
    ...createVideoKeyHandlers(props.videoController as any),
    'ctrl+shift+space': () =>
      runInAction(() => {
        props.sessionDisplay.setFullVideoWidth(
          !props.sessionDisplay.fullVideoWidth
        );
      }),
    'ctrl+shift+insert': () =>
      props.cutPointsAddition.add({ cutPointType: 'start' }),
    'ctrl+shift+alt+insert': () =>
      props.cutPointsAddition.add({ cutPointType: 'end' }),
    'ctrl+shift+l': () => {
      jQuery('#linkPanelInput').focus();
    },
  };
  const videoKeys = keys(videoKeyHandlers);
  const onKeyDown = createKeyDownHandler(videoKeyHandlers);
  return (
    <KeyboardEventHandler handleKeys={videoKeys} onKeyEvent={onKeyDown}>
      <div id={props.moveDisplay.rootDivId} tabIndex={123}>
        {props.children}
      </div>
    </KeyboardEventHandler>
  );
});
