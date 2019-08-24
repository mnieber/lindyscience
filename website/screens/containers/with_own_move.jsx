// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";

import { getStore } from "app/store";

import Widgets from "screens/presentation/index";
import { MoveListTitle } from "move_lists/presentation/move_list_details";
import { withHostedOwnMovePanels } from "screens/containers/with_hosted_own_move_panels";
import { withMoveCrudBvrsContext } from "screens/containers/move_crud_behaviours";

import type { MoveT } from "moves/types";
import type { MoveListT } from "move_lists/types";
import type { MoveCrudBvrsT } from "screens/types";
import type { UserProfileT } from "profiles/types";
import type { TagT } from "tags/types";

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
        moveListTitle={moveListTitle}
        moveTags={moveTags}
        buttons={[editMoveBtn]}
        hostedPanels={hostedOwnMovePanels}
      />
    );

    return <WrappedComponent ownMove={ownMove} {...passThroughProps} />;
  }
);
