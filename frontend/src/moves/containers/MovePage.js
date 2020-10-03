// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { Display as MoveDisplay } from 'src/moves/MoveCtr/facets/Display';
import type { MoveT } from 'src/moves/types';
import { Navigation, getStatus } from 'src/session/facets/Navigation';
import type { MoveListT } from 'src/move_lists/types';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { withMoveForm } from 'src/moves/hocs/withMoveForm';
import { withMovePrivateDataPanel } from 'src/moves/hocs/withMovePrivateDataPanel';
import { withTipsPanel } from 'src/tips/hocs/withTipsPanel';
import { withMoveHeader } from 'src/moves/hocs/withMoveHeader';
import { withVideoPlayerPanel } from 'src/video/hocs/withVideoPlayerPanel';
import { withMoveKeyHandlers } from 'src/moves/hocs/withMoveKeyHandlers';
import { Move } from 'src/moves/presentation/Move';
import { createKeyDownHandler } from 'src/video/presentation/VideoKeyhandler';
import { Editing } from 'src/npm/facet-mobx/facets/editing';
import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';

type PropsT = {
  defaultProps?: any,
};

type DefaultPropsT = {
  navigation: Navigation,
  moveList: MoveListT,
  move: MoveT,
  moveDisplay: MoveDisplay,
  movesEditing: Editing,
  videoController: VideoController,
  moveForm: any,
  movePrivateDataPanel: any,
  tipsPanel: any,
  moveHeader: any,
  videoPlayerPanel: any,
  moveKeyHandlers: any,
};

export const MovePage: (PropsT) => any = compose(
  withDefaultProps,
  withMoveForm,
  withMovePrivateDataPanel,
  withTipsPanel,
  withMoveHeader,
  withVideoPlayerPanel,
  withMoveKeyHandlers,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  if (!props.moveList) {
    const status = getStatus(props.navigation);
    const notFoundDiv = <div>Oops, I cannot find this move list</div>;
    const loadingDiv = <div>Loading move list, please wait...</div>;
    return status.moveListUrl.notFound ? notFoundDiv : loadingDiv;
  }

  if (!props.move) {
    return <div>Oops, I cannot find this move</div>;
  }

  const moveDiv = props.movesEditing.isEditing ? (
    <React.Fragment>
      {props.videoPlayerPanel}
      {props.moveForm}
    </React.Fragment>
  ) : (
    <React.Fragment>
      {props.moveHeader}
      {props.videoPlayerPanel}
      <Move move={props.move} videoController={props.videoController} />
      {props.movePrivateDataPanel}
      {props.tipsPanel}
    </React.Fragment>
  );

  const videoKeys = Object.keys(props.moveKeyHandlers);
  const onKeyDown = createKeyDownHandler(props.moveKeyHandlers);

  return (
    <KeyboardEventHandler handleKeys={videoKeys} onKeyEvent={onKeyDown}>
      <div id={props.moveDisplay.rootDivId} tabIndex={123}>
        {moveDiv}
      </div>
    </KeyboardEventHandler>
  );
});