// @flow

import * as React from "react";
import { compose } from "redux";
import Ctr from "moves/containers/index";

import { withStaticMove } from "moves/containers/with_static_move";
import { withOwnMove } from "moves/containers/with_own_move";
import { withMoveCrudBvrsContext } from "moves/containers/move_crud_behaviours";

import { newMoveSlug } from "moves/utils";
import { isOwner } from "app/utils";

import { MoveCrudBvrsContext } from "moves/containers/move_crud_behaviours";

import type { UUID } from "app/types";
import type { UserProfileT } from "profiles/types";
import type { MoveT, MoveCrudBvrsT } from "moves/types";

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
