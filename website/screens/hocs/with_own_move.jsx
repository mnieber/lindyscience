// @flow

import { compose } from "redux";
import * as React from "react";

import type { MoveCrudBvrsT } from "screens/types";
import type { MoveListT } from "move_lists/types";
import { MoveListTitle } from "move_lists/presentation/move_list_details";
import type { MoveT } from "moves/types";
import type { TagT } from "tags/types";
import type { UserProfileT } from "profiles/types";
import type { VideoT } from "video/types";
import { VideoPlayer } from "video/presentation/video_player";
import { useVideo } from "video/bvrs/video_behaviour";
import { getStore } from "app/store";
import { getVideoFromMove } from "moves/utils";
import { truncDecimals } from "utils/utils";
import { withHostedOwnMovePanels } from "screens/hocs/with_hosted_own_move_panels";
import { withMoveCrudBvrsContext } from "screens/bvrs/move_crud_behaviours";
import { VideoControlPanel } from "video/presentation/video_control_panel";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";

type PropsT = {
  move: MoveT,
  userProfile: UserProfileT,
  moveList: MoveListT,
  moveTags: Array<TagT>,
  hostedOwnMovePanels: any,
  moveCrudBvrs: MoveCrudBvrsT,
  proposedMoveData: any,
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
      proposedMoveData: Ctr.fromStore.getProposedMoveData(state),
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
      proposedMoveData,
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

    const video: ?VideoT = move && move.link ? getVideoFromMove(move) : null;
    const videoBvr = useVideo(video);
    const setProposedStartTime = x =>
      actions.actSetProposedMoveData({
        ...proposedMoveData,
        startTime: truncDecimals(x, 2),
      });

    const videoPlayerPanel = videoBvr.video ? (
      <div className={"move__video panel flex flex-col"}>
        <VideoPlayer videoBvr={videoBvr} />
        <VideoControlPanel
          videoBvr={videoBvr}
          setIsEditing={moveCrudBvrs.setIsEditing}
          setProposedStartTime={setProposedStartTime}
        />
      </div>
    ) : (
      <React.Fragment />
    );

    const ownMove = moveCrudBvrs.isEditing ? (
      <div>
        <Widgets.MoveForm
          userProfile={userProfile}
          autoFocus={true}
          move={move}
          onSubmit={moveCrudBvrs.saveMoveBvr.saveItem}
          onCancel={moveCrudBvrs.saveMoveBvr.discardChanges}
          knownTags={moveTags}
          videoBvr={videoBvr}
          proposedMoveData={proposedMoveData}
        />
        {videoPlayerPanel}
      </div>
    ) : (
      <Widgets.Move
        move={move}
        userProfile={userProfile}
        moveListTitle={moveListTitle}
        moveTags={moveTags}
        buttons={[editMoveBtn]}
        hostedPanels={hostedOwnMovePanels}
        videoPlayerPanel={videoPlayerPanel}
      />
    );

    return <WrappedComponent ownMove={ownMove} {...passThroughProps} />;
  }
);
