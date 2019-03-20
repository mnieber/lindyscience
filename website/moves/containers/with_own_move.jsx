// @flow

import * as React from "react";
import { compose } from "redux";

import MovesCtr from "moves/containers/index";
import AppCtr from "app/containers/index";

import Widgets from "moves/presentation/index";
import { withMovePrivateDataPanel } from "moves/containers/with_move_private_data_panel";
import { withMoveCrudBvrsContext } from "moves/containers/move_crud_behaviours";
import { withVideoLinksPanel } from "moves/containers/with_videolinks_panel";
import { withTipsPanel } from "moves/containers/with_tips_panel";

import type {
  MoveT,
  TipT,
  TipsByIdT,
  VideoLinksByIdT,
  MoveListT,
  MoveCrudBvrsT,
} from "moves/types";
import type { UUID, VoteT, UserProfileT, VoteByIdT, TagT } from "app/types";

type PropsT = {
  move: MoveT,
  userProfile: UserProfileT,
  moveList: MoveListT,
  moveTags: Array<TagT>,
  movePrivateDataPanel: any,
  tipsPanel: any,
  videoLinksPanel: any,
  moveCrudBvrs: MoveCrudBvrsT,
  // receive any actions as well
};

// $FlowFixMe
export const withOwnMove = compose(
  withMovePrivateDataPanel,
  withMoveCrudBvrsContext,
  withTipsPanel,
  withVideoLinksPanel,
  MovesCtr.connect(
    state => ({
      userProfile: AppCtr.fromStore.getUserProfile(state),
      move: MovesCtr.fromStore.getHighlightedMove(state),
      moveList: MovesCtr.fromStore.getSelectedMoveList(state),
      moveTags: MovesCtr.fromStore.getMoveTags(state),
    }),
    {
      ...AppCtr.actions,
      ...MovesCtr.actions,
    }
  ),
  (WrappedComponent: any) => (props: any) => {
    const {
      move,
      moveList,
      moveCrudBvrs,
      userProfile,
      moveTags,
      videoLinksPanel,
      tipsPanel,
      movePrivateDataPanel,
      ...passThroughProps
    }: PropsT = props;

    const actions: any = props;

    const editMoveBtn = (
      <div
        className={"move__editBtn button button--wide ml-2"}
        onClick={() => moveCrudBvrs.setIsEditing(true)}
        key={1}
      >
        Edit move
      </div>
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
        />
      </div>
    ) : (
      <Widgets.Move
        move={move}
        userProfile={userProfile}
        moveList={moveList}
        moveTags={moveTags}
        buttons={[editMoveBtn]}
        videoLinksPanel={videoLinksPanel}
        tipsPanel={tipsPanel}
        movePrivateDataPanel={movePrivateDataPanel}
      />
    );

    return <WrappedComponent ownMove={ownMove} {...passThroughProps} />;
  }
);
