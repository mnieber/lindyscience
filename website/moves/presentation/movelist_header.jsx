// @flow

import * as React from "react";
import classnames from "classnames";

// MoveListHeader

type MoveListHeaderPropsT = {|
  addNewMove: Function,
  playMoves: Function,
  className: string,
|};

export function MoveListHeader(props: MoveListHeaderPropsT) {
  const newMoveBtn = (
    <div
      className={"moveListHeader__addButton button button--wide"}
      onClick={props.addNewMove}
    >
      New move
    </div>
  );

  const playMovesBtn = (
    <div
      className={"moveListHeader__addButton button button--wide ml-2"}
      onClick={props.playMoves}
    >
      Play moves
    </div>
  );

  return (
    <div
      className={classnames("moveListHeader flex flex-wrap", props.className)}
    >
      {newMoveBtn}
      {playMovesBtn}
    </div>
  );
}
