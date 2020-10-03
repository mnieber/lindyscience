// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';

import { MoveContextMenu } from 'src/moves/presentation/MoveContextMenu';
import { mergeDefaultProps, withDefaultProps } from 'src/npm/mergeDefaultProps';
import type { MoveListT } from 'src/move_lists/types';
import { Clipboard } from 'src/moves/MovesCtr/facets/Clipboard';
import { getId } from 'src/app/utils';

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////

type PropsT = {
  defaultProps?: any,
};

type DefaultPropsT = {
  moveLists: Array<MoveListT>,
  movesClipboard: Clipboard,
  moveList: MoveListT,
  isOwner: (any) => boolean,
};

export const withMoveContextMenu = compose(
  withDefaultProps,
  observer,
  (WrappedComponent: any) => (p: PropsT) => {
    const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

    const moveListId = getId(props.moveList);
    const targetMoveLists = props.movesClipboard.targetMoveLists;

    const targetMoveListsForMoving = props.moveLists.filter(
      (x) => moveListId != getId(x)
    );

    const moveContextMenu = (
      <MoveContextMenu
        targetMoveLists={targetMoveLists || []}
        targetMoveListsForMoving={targetMoveListsForMoving}
        movesClipboard={props.movesClipboard}
        isOwnerOfMoveList={props.moveList && props.isOwner(props.moveList)}
      />
    );

    // $FlowFixMe
    return <WrappedComponent moveContextMenu={moveContextMenu} {...p} />;
  }
);
