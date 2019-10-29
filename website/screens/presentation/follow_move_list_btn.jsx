// @flow

import * as React from "react";
import { observer } from "mobx-react";
import { compose } from "redux";

import type { MoveListT } from "move_lists/types";
import { mergeDefaultProps, withDefaultProps } from "screens/default_props";
import { Labelling } from "facet-mobx/facets/labelling";

type PropsT = {
  defaultProps: any,
} & {
  // default props
  moveList: MoveListT,
  moveListsLabelling: Labelling,
};

// $FlowFixMe
export const FollowMoveListBtn = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props = mergeDefaultProps(p);

  const isFollowing = props.moveListsLabelling
    .ids("following")
    .includes(props.moveList.id);

  return (
    <div
      className={"button button--wide ml-2"}
      onClick={() =>
        props.moveListsLabelling.setLabel({
          label: "following",
          id: props.moveList.id,
          flag: !isFollowing,
        })
      }
      key={2}
    >
      {isFollowing ? "Stop following" : "Follow"}
    </div>
  );
});
