// @flow

import { compose } from "redux";
import * as React from "react";

import { MoveListTitle } from "move_lists/presentation/move_list_details";
import { VideoPlayer, VideoPlayerPanel } from "video/presentation/video_player";
import { getStore } from "app/store";
import { truncDecimals } from "utils/utils";
import { useFocus } from "utils/use_focus";
import { withHostedOwnMovePanels } from "screens/hocs/with_hosted_own_move_panels";
import { withMoveCrudBvrsContext } from "screens/bvrs/move_crud_behaviours";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";

import type { MoveCrudBvrsT } from "screens/types";
import type { MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import type { TagT } from "tags/types";
import type { UserProfileT } from "profiles/types";
import type { VideoBvrT } from "video/types";

type PropsT = {
  move: MoveT,
  userProfile: UserProfileT,
  moveList: MoveListT,
  moveTags: Array<TagT>,
  hostedOwnMovePanels: any,
  moveCrudBvrs: MoveCrudBvrsT,
  videoBvr: VideoBvrT,
  // receive any actions as well
};

function getMove() {
  const state = getStore().getState();
  return Ctr.fromStore.getHighlightedMove(state);
}

// $FlowFixMe
export const withOwnMove = compose(
  withMoveCrudBvrsContext,
  withHostedOwnMovePanels(getMove),
  Ctr.connect(
    state => ({
      userProfile: Ctr.fromStore.getUserProfile(state),
      move: Ctr.fromStore.getHighlightedMove(state),
      moveList: Ctr.fromStore.getSelectedMoveList(state),
      moveTags: Ctr.fromStore.getMoveTags(state),
    }),
    Ctr.actions
  ),
  (WrappedComponent: any) => (props: any) => {
    const {
      move,
      moveList,
      moveCrudBvrs,
      userProfile,
      moveTags,
      hostedOwnMovePanels,
      ...passThroughProps
    }: PropsT = props;

    const actions: any = props;

    const moveListTitle = <MoveListTitle moveList={moveList} />;

    const editMoveBtn = (
      <div
        className={"move__editBtn button button--wide ml-2"}
        onClick={() => moveCrudBvrs.setIsEditing(true)}
        key={1}
      >
        Edit move
      </div>
    );

    const moveDivRef = React.useRef(null);
    useFocus(moveDivRef.current);

    const videoPlayerPanel = (
      <VideoPlayerPanel key="videoPlayerPanel" videoBvr={props.videoBvr} />
    );

    const ownMove = moveCrudBvrs.isEditing ? (
      <div>
        {videoPlayerPanel}
        <Widgets.MoveForm
          autoFocus={true}
          move={move}
          onSubmit={moveCrudBvrs.saveMoveBvr.saveItem}
          onCancel={moveCrudBvrs.saveMoveBvr.discardChanges}
          knownTags={moveTags}
          videoPlayer={props.videoBvr.player}
        />
      </div>
    ) : (
      <div id="moveDiv" tabIndex={123} ref={moveDivRef}>
        <Widgets.MoveHeader
          move={move}
          moveListTitle={moveListTitle}
          moveTags={moveTags}
          buttons={[editMoveBtn]}
        />
        {videoPlayerPanel}
        <Widgets.Move move={move} videoPlayer={props.videoBvr.player} />
        {hostedOwnMovePanels}
      </div>
    );

    return <WrappedComponent ownMove={ownMove} {...passThroughProps} />;
  }
);
