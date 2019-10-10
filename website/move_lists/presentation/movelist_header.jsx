// @flow

import * as React from "react";
import classnames from "classnames";

// MoveListHeader

type MoveListHeaderPropsT = {|
  addNewMove: Function,
  className: string,
|};

export function MoveListHeader(props: MoveListHeaderPropsT) {
  const newMoveBtn = (
    <div
      key="newMoveBtn"
      className={classnames(
        props.className,
        "moveListHeader__addButton button button--wide"
      )}
      onClick={props.addNewMove}
    >
      New move
    </div>
  );

  return [newMoveBtn];
}
