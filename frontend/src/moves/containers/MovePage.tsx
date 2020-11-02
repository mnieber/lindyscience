import { compose, keys } from 'lodash/fp';
import * as React from 'react';
import { observer } from 'mobx-react';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import { VideoPlayerPanel } from 'src/video/presentation/VideoPlayerPanel';
import { MovePrivateDataPanel } from 'src/moves/presentation/MovePrivateDataPanel';
import { MoveHeader } from 'src/moves/presentation/MoveHeader';
import { TipsPanel } from 'src/tips/presentation/TipsPanel';
import { Display as MoveDisplay } from 'src/moves/MoveCtr/facets/Display';
import { MoveT } from 'src/moves/types';
import { Navigation, getStatus } from 'src/session/facets/Navigation';
import { MoveListT } from 'src/move_lists/types';
import { VideoController } from 'src/moves/MoveCtr/facets/VideoController';
import { withMoveForm } from 'src/moves/hocs/withMoveForm';
import { withMoveKeyHandlers } from 'src/moves/hocs/withMoveKeyHandlers';
import { Move } from 'src/moves/presentation/Move';
import { createKeyDownHandler } from 'src/video/presentation/VideoKeyhandler';
import { Editing } from 'facet-mobx/facets/Editing';
import { useDefaultProps, FC } from 'react-default-props-context';

type PropsT = {};

type DefaultPropsT = {
  navigation: Navigation;
  moveList: MoveListT;
  move: MoveT;
  moveDisplay: MoveDisplay;
  movesEditing: Editing;
  videoController: VideoController;
  moveForm: any;
  moveKeyHandlers: any;
};

export const MovePage: FC<PropsT, DefaultPropsT> = compose(
  withMoveForm,
  withMoveKeyHandlers,
  observer
)((p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

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
      <VideoPlayerPanel />
      {props.moveForm}
    </React.Fragment>
  ) : (
    <React.Fragment>
      <MoveHeader />
      <VideoPlayerPanel />
      <Move move={props.move} videoController={props.videoController} />
      <MovePrivateDataPanel />
      <TipsPanel />
    </React.Fragment>
  );

  const videoKeys = keys(props.moveKeyHandlers);
  const onKeyDown = createKeyDownHandler(props.moveKeyHandlers);

  return (
    <KeyboardEventHandler handleKeys={videoKeys} onKeyEvent={onKeyDown}>
      <div id={props.moveDisplay.rootDivId} tabIndex={123}>
        {moveDiv}
      </div>
    </KeyboardEventHandler>
  );
});
