import { compose } from 'lodash/fp';
import * as React from 'react';
import { observer } from 'mobx-react';

import { MoveContextMenu } from 'src/moves/presentation/MoveContextMenu';
import { useDefaultProps } from 'react-default-props-context';
import { MoveListT } from 'src/move_lists/types';
import { Clipboard } from 'src/moves/MovesCtr/facets/Clipboard';
import { getId } from 'src/app/utils';

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////

type PropsT = {};

type DefaultPropsT = {
  moveLists: Array<MoveListT>;
  movesClipboard: Clipboard;
  moveList: MoveListT;
  isOwner: (obj: any) => boolean;
};

export const withMoveContextMenu = compose(
  observer,
  (WrappedComponent: any) => (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    const moveListId = getId(props.moveList);
    const targetMoveLists = props.movesClipboard.targetMoveLists;

    const targetMoveListsForMoving = props.moveLists.filter(
      (x: MoveListT) => moveListId !== getId(x)
    );

    const moveContextMenu = (
      <MoveContextMenu
        targetMoveLists={targetMoveLists || []}
        targetMoveListsForMoving={targetMoveListsForMoving}
        movesClipboard={props.movesClipboard}
        isOwnerOfMoveList={props.moveList && props.isOwner(props.moveList)}
      />
    );

    return <WrappedComponent moveContextMenu={moveContextMenu} {...p} />;
  }
);
