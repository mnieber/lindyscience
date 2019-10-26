// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import { Labelling } from "screens/data_containers/bvrs/labelling";
import { withMoveListsCtr } from "screens/data_containers/movelists_container_context";
import { MoveListsContainer } from "screens/data_containers/movelists_container";
import Ctr from "screens/containers/index";

type PropsT = {
  moveListsCtr: MoveListsContainer,
};

// $FlowFixMe
export const withFollowMoveListBtn = compose(
  withMoveListsCtr,
  observer,
  Ctr.connect(state => ({})),
  (WrappedComponent: any) => (props: any) => {
    const { ...passThroughProps }: PropsT = props;
    const labelling = Labelling.get(props.moveListsCtr);
    const moveList = props.moveListsCtr.highlight.item;
    const isFollowing = labelling.ids("following").includes(moveList.id);

    const followMoveListBtn = (
      <div
        className={"button button--wide ml-2"}
        onClick={() =>
          labelling.setLabel("following", moveList.id, !isFollowing)
        }
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
