// @flow

import { compose } from 'rambda';
import * as React from 'react';
import { observer } from 'mobx-react';

import { mergeDefaultProps, withDefaultProps } from 'src/mergeDefaultProps';
import type { MoveListT } from 'src/move_lists/types';
import { Clipboard } from 'src/screens/moves_container/facets/clipboard';
import { getId } from 'src/app/utils';
import Widgets from 'src/screens/presentation/index';

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
      <Widgets.MoveContextMenu
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
