// @flow

import * as React from "react";
import { observer } from "mobx-react";

import { withMoveListsCtr } from "screens/data_containers/movelists_container_context";
import { Labelling } from "screens/data_containers/bvrs/labelling";
import { MoveListsContainer } from "screens/data_containers/movelists_container";

type PropsT = {
  moveListsCtr: MoveListsContainer,
};

// $FlowFixMe
export const FollowMoveListBtn = withMoveListsCtr(
  observer((props: PropsT) => {
    const labelling = Labelling.get(props.moveListsCtr);
    const moveList = props.moveListsCtr.highlight.item;
    const isFollowing = labelling.ids("following").includes(moveList.id);

    return (
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
  })
);
