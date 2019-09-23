// @flow

import { compose } from "redux";
import * as React from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";

import { MoveListTitle } from "move_lists/presentation/move_list_details";
import { VideoPlayer, VideoPlayerPanel } from "video/presentation/video_player";
import { useVideo } from "video/bvrs/video_behaviour";
import { getStore } from "app/store";
import { getVideoFromMove } from "moves/utils";
import { truncDecimals } from "utils/utils";
import { withHostedOwnMovePanels } from "screens/hocs/with_hosted_own_move_panels";
import { withMoveCrudBvrsContext } from "screens/bvrs/move_crud_behaviours";
import Ctr from "screens/containers/index";
import Widgets from "screens/presentation/index";
import {
  handleVideoKey,
  videoKeys,
} from "screens/presentation/video_keyhandler";

import type { MoveCrudBvrsT } from "screens/types";
import type { MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import type { TagT } from "tags/types";
import type { UserProfileT } from "profiles/types";
import type { VideoT } from "video/types";

type PropsT = {
  move: MoveT,
  userProfile: UserProfileT,
  moveList: MoveListT,
  moveTags: Array<TagT>,
  hostedOwnMovePanels: any,
  moveCrudBvrs: MoveCrudBvrsT,
  // receive any actions as well
};

function getMove() {
  const state = getStore().getState();
  return Ctr.fromStore.getHighlightedMove(state);
}

// Use this form to prevent re-rendering when the user
// interacts with the video
const MemoMoveForm = React.memo(Widgets.MoveForm);

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

    const video: ?VideoT = move && move.link ? getVideoFromMove(move) : null;
    const videoBvr = useVideo(video);

    const moveNotEditingRef = React.useRef(null);

    React.useEffect(() => {
      if (moveNotEditingRef.current) {
        moveNotEditingRef.current.focus();
      }
    }, [moveNotEditingRef.current]);

    const videoPlayerPanel = (
      <VideoPlayerPanel
        videoBvr={videoBvr}
        setIsEditing={moveCrudBvrs.setIsEditing}
      />
    );

    const ownMove = moveCrudBvrs.isEditing ? (
      <div>
        {videoPlayerPanel}
        <MemoMoveForm
          autoFocus={true}
          move={move}
          onSubmit={moveCrudBvrs.saveMoveBvr.saveItem}
          onCancel={moveCrudBvrs.saveMoveBvr.discardChanges}
          knownTags={moveTags}
          videoPlayer={videoBvr.player}
        />
      </div>
    ) : (
      <div id="moveNotEditing" tabIndex={123} ref={moveNotEditingRef}>
        <Widgets.MoveHeader
          move={move}
          moveListTitle={moveListTitle}
          moveTags={moveTags}
          buttons={[editMoveBtn]}
        />
        {videoPlayerPanel}
        <Widgets.Move move={move} videoPlayer={videoBvr.player} />
        {hostedOwnMovePanels}
      </div>
    );

    const onKeyDown = (key, e) => handleVideoKey(key, e, videoBvr);

    const ownMoveWithKeyHandler = (
      <KeyboardEventHandler handleKeys={videoKeys} onKeyEvent={onKeyDown}>
        {ownMove}
      </KeyboardEventHandler>
    );

    return (
      <WrappedComponent ownMove={ownMoveWithKeyHandler} {...passThroughProps} />
    );
  }
);
