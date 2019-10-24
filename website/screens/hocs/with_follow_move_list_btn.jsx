// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import { withMoveListsCtr } from "screens/data_containers/movelists_container_context";
import { MoveListsContainer } from "screens/data_containers/movelists_container";
import Ctr from "screens/containers/index";
import { actInsertMoveListIds, actRemoveMoveListIds } from "profiles/actions";
import { createErrorHandler } from "app/utils";
import { apiSaveMoveListOrdering } from "move_lists/api";

type PropsT = {
  moveListsCtr: MoveListsContainer,
};

// $FlowFixMe
export const withFollowMoveListBtn = compose(
  withMoveListsCtr,
  observer,
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
  })),
  (WrappedComponent: any) => (props: any) => {
    const moveList = props.moveListsCtr.highlight.item;
    const userProfile = props.userProfile;
    const { ...passThroughProps }: PropsT = props;

    const _setIsFollowing = isFollowing => {
      if (!!userProfile && !!moveList) {
        const moveListId = moveList.id;
        const newMoveListIds = isFollowing
          ? props.dispatch(actInsertMoveListIds([moveListId], "", false))
          : props.dispatch(actRemoveMoveListIds([moveListId]));
        const term = isFollowing ? "follow" : "unfollow";
        apiSaveMoveListOrdering(newMoveListIds).catch(
          createErrorHandler(`Could not ${term} the move list`)
        );
      }
    };

    const isFollowing =
      !!moveList &&
      !!userProfile &&
      userProfile.moveListIds.includes(moveList.id);

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
