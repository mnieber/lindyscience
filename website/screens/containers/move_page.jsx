// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";
import { actSetHighlightedMoveBySlug } from "screens/actions";
import { withStaticMove } from "screens/hocs/with_static_move";
import { withOwnMove } from "screens/hocs/with_own_move";
import { withMoveCrudBvrsContext } from "screens/bvrs/move_crud_behaviours";
import { withMoveVideoBvr } from "screens/hocs/with_move_video_bvr";
import { newMoveSlug } from "moves/utils";
import { isOwner } from "app/utils";

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
  dispatch: Function,
  // the follower are inserted by the router
  moveSlugPrm: string,
  moveIdPrm: ?UUID,
};

function MovePage(props: MovePagePropsT) {
  React.useEffect(() => {
    if (
      props.userProfile &&
      props.moveSlugPrm == newMoveSlug &&
      !props.moveCrudBvrs.editMoveBvr.newItem
    ) {
      props.moveCrudBvrs.editMoveBvr.addNewItem({});
    }
    props.dispatch(
      actSetHighlightedMoveBySlug(props.moveSlugPrm, props.moveIdPrm)
    );
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
  withMoveVideoBvr,
  withStaticMove,
  withOwnMove,
  withMoveCrudBvrsContext,
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
    highlightedMove: Ctr.fromStore.getHighlightedMove(state),
    hasLoadedSelectedMoveList: Ctr.fromStore.hasLoadedSelectedMoveList(state),
  }))
)(MovePage);

export default MovePage;
