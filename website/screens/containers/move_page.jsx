// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";
import KeyboardEventHandler from "react-keyboard-event-handler";

import { withMoveKeyHandlers } from "screens/hocs/with_move_key_handlers";
import { createKeyDownHandler } from "screens/presentation/video_keyhandler";
import { withVideoPlayerPanel } from "screens/hocs/with_video_player_panel";
import { Editing } from "facet-mobx/facets/editing";
import { Move } from "moves/presentation/move";
import { VideoController } from "screens/move_container/facets/video_controller";
import { withMovePrivateDataPanel } from "screens/hocs/with_move_private_data_panel";
import { withTipsPanel } from "screens/hocs/with_tips_panel";
import { withMoveForm } from "screens/hocs/with_move_form";
import { withMoveHeader } from "screens/hocs/with_move_header";
import { Display as MoveDisplay } from "screens/move_container/facets/display";
import {
  Navigation,
  getStatus,
} from "screens/session_container/facets/navigation";
import type { MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import { mergeDefaultProps, withDefaultProps } from "mergeDefaultProps";
import Ctr from "screens/containers/index";

type PropsT = {
  movePrivateDataPanel: any,
  tipsPanel: any,
  moveForm: any,
  moveHeader: any,
  videoPlayerPanel: any,
  moveKeyHandlers: any,
  defaultProps: any,
};

type DefaultPropsT = {
  navigation: Navigation,
  moveList: MoveListT,
  move: MoveT,
  moveDisplay: MoveDisplay,
  movesEditing: Editing,
  videoCtr: VideoController,
};

const _MovePage = (p: PropsT) => {
  const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);

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
      <Move move={props.move} videoCtr={props.videoCtr} />
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
};

// $FlowFixMe
export const MovePage = compose(
  Ctr.connect(state => ({
    moveTags: Ctr.fromStore.getMoveTags(state),
  })),
  withDefaultProps,
  withMoveForm,
  withMovePrivateDataPanel,
  withTipsPanel,
  withMoveHeader,
  withVideoPlayerPanel,
  withMoveKeyHandlers,
  observer
)(_MovePage);

export default MovePage;
