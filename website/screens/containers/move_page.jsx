// @flow

import * as React from "react";
import { compose } from "redux";
import Ctr from "screens/containers/index";

import { withStaticMove } from "screens/containers/with_static_move";
import { withOwnMove } from "screens/containers/with_own_move";
import { withMoveCrudBvrsContext } from "screens/containers/move_crud_behaviours";

import { newMoveSlug } from "screens/utils";
import { isOwner } from "app/utils";

import { MoveCrudBvrsContext } from "screens/containers/move_crud_behaviours";

import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";
import type { MoveCrudBvrsT } from "screens/types";
import type { MoveT } from "moves/types";

type MovePagePropsT = {
  movePrivateDataPanel: any,
  staticMove: any,
  ownMove: any,
  moveCrudBvrs: MoveCrudBvrsT,
  userProfile: UserProfileT,
  highlightedMove: MoveT,
  hasLoadedSelectedMoveList: boolean,
  actions: any,
  // the follower are inserted by the router
  moveSlugPrm: string,
  moveIdPrm: ?UUID,
};

function MovePage(props: MovePagePropsT) {
  const actions: any = props;

  React.useEffect(() => {
    if (
      props.userProfile &&
      props.moveSlugPrm == newMoveSlug &&
      !props.moveCrudBvrs.newMoveBvr.newItem
    ) {
      props.moveCrudBvrs.newMoveBvr.addNewItem();
    }
    actions.actSetHighlightedMoveBySlug(props.moveSlugPrm, props.moveIdPrm);
  }, [props.moveSlugPrm, props.moveIdPrm, props.userProfile]);

  if (!props.highlightedMove) {
    const msg = props.hasLoadedSelectedMoveList
      ? "Oops, I cannot find this move"
      : "Loading, please wait...";

    return <div className="noMoveHighlighted">{msg}</div>;
  }

  return isOwner(props.userProfile, props.highlightedMove.ownerId)
    ? props.ownMove
    : props.staticMove;
}

// $FlowFixMe
MovePage = compose(
  withStaticMove,
  withOwnMove,
  withMoveCrudBvrsContext,
  Ctr.connect(
    state => ({
      userProfile: Ctr.fromStore.getUserProfile(state),
      highlightedMove: Ctr.fromStore.getHighlightedMove(state),
      hasLoadedSelectedMoveList: Ctr.fromStore.hasLoadedSelectedMoveList(state),
    }),
    Ctr.actions
  )
)(MovePage);

export default MovePage;
