// @flow

import * as React from 'react'
import classnames from 'classnames';

// MoveListHeader

type MoveListHeaderPropsT = {|
  addNewMove: Function,
  className: string,
|};

export function MoveListHeader(props: MoveListHeaderPropsT) {
  const newMoveBtn = (
    <div
      className={"moveListHeader__addButton button button--wide ml-2"}
      onClick={props.addNewMove}
    >
    New move
    </div>
  );

  return (
    <div className= {classnames("moveListHeader flex flex-wrap", props.className)}>
      {newMoveBtn}
    </div>
  );
}
