// @flow

import * as React from "react";
import { compose } from "redux";

import Ctr from "screens/containers/index";
import { actInsertMoveListIds, actRemoveMoveListIds } from "profiles/actions";
import { createErrorHandler } from "app/utils";

import type { MoveListT } from "move_lists/types";
import type { UserProfileT } from "profiles/types";

type PropsT = {
  moveList: MoveListT,
  userProfile: UserProfileT,
  // receive any actions as well
};

// $FlowFixMe
export const withFollowMoveListBtn = compose(
  Ctr.connect(state => ({
    moveList: Ctr.fromStore.getSelectedMoveList(state),
    userProfile: Ctr.fromStore.getUserProfile(state),
  })),
  (WrappedComponent: any) => (props: any) => {
    const { ...passThroughProps }: PropsT = props;

    const _setIsFollowing = isFollowing => {
      if (!!props.userProfile && !!props.moveList) {
        const moveListId = props.moveList.id;
        const newMoveListIds = isFollowing
          ? props.dispatch(actInsertMoveListIds([moveListId], "", false))
          : props.dispatch(actRemoveMoveListIds([moveListId]));
        const term = isFollowing ? "follow" : "unfollow";
        Ctr.api
          .saveMoveListOrdering(newMoveListIds)
          .catch(createErrorHandler(`Could not ${term} the move list`));
      }
    };

    const isFollowing =
      !!props.moveList &&
      !!props.userProfile &&
      props.userProfile.moveListIds.includes(props.moveList.id);

    const followMoveListBtn = (
      <div
        className={"button button--wide ml-2"}
        onClick={() => _setIsFollowing(!isFollowing)}
        key={2}
      >
        {isFollowing ? "Stop following" : "Follow"}
      </div>
    );

    return (
      <WrappedComponent
        followMoveListBtn={followMoveListBtn}
        {...passThroughProps}
      />
    );
  }
);
