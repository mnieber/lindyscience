// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { withMoveKeyHandlers } from 'src/screens/hocs/with_move_key_handlers';
import { createKeyDownHandler } from 'src/screens/presentation/video_keyhandler';
import { withVideoPlayerPanel } from 'src/screens/hocs/with_video_player_panel';
import { Editing } from 'src/facet-mobx/facets/editing';
import { Move } from 'src/moves/presentation/move';
import { VideoController } from 'src/screens/move_container/facets/video_controller';
import { withMovePrivateDataPanel } from 'src/screens/hocs/with_move_private_data_panel';
import { withTipsPanel } from 'src/screens/hocs/with_tips_panel';
import { withMoveForm } from 'src/screens/hocs/with_move_form';
import { withMoveHeader } from 'src/screens/hocs/with_move_header';
import { Display as MoveDisplay } from 'src/screens/move_container/facets/display';
import {
  Navigation,
  getStatus,
} from 'src/screens/session_container/facets/navigation';
import type { MoveListT } from 'src/move_lists/types';
import type { MoveT } from 'src/moves/types';
import { mergeDefaultProps, withDefaultProps } from 'src/mergeDefaultProps';

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
