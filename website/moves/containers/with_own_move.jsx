// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "moves/containers/index";

import Widgets from "moves/presentation/index";
import { withHostedOwnMovePanels } from "moves/containers/with_hosted_own_move_panels";
import { withMoveCrudBvrsContext } from "moves/containers/move_crud_behaviours";

import type { MoveT, MoveListT, MoveCrudBvrsT } from "moves/types";
import type { UserProfileT, TagT } from "profiles/types";

type PropsT = {
  move: MoveT,
  userProfile: UserProfileT,
  moveList: MoveListT,
  moveTags: Array<TagT>,
  hostedOwnMovePanels: any,
  moveCrudBvrs: MoveCrudBvrsT,
  // receive any actions as well
};

// $FlowFixMe
export const withOwnMove = compose(
  withMoveCrudBvrsContext,
  withHostedOwnMovePanels,
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
        hostedPanels={hostedOwnMovePanels}
      />
    );

    return <WrappedComponent ownMove={ownMove} {...passThroughProps} />;
  }
);
