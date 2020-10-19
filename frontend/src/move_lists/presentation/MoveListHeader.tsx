import * as React from 'react';
import classnames from 'classnames';

// MoveListHeader

type PropsT = {
  addNewMove: Function;
  className: string;
};

export const MoveListHeader: React.FC<PropsT> = (props) => {
  const newMoveBtn = (
    <div
      key="newMoveBtn"
      className={classnames(
        props.className,
        'moveListHeader__addButton button button--wide'
      )}
      onClick={() => props.addNewMove()}
    >
      New move
    </div>
  );

  return <React.Fragment>{newMoveBtn}</React.Fragment>;
};
