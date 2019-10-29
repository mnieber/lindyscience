// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import { mergeDefaultProps, withDefaultProps } from "screens/default_props";
import type { MoveListT } from "move_lists/types";
import { Clipboard } from "screens/moves_container/facets/clipboard";
import { getId } from "app/utils";
import Widgets from "screens/presentation/index";

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////

type PropsT = {
  defaultProps: any,
};

type DefaultPropsT = {
  // default props
  moveLists: Array<MoveListT>,
  movesClipboard: Clipboard,
  moveList: MoveListT,
  isOwner: any => boolean,
};

// $FlowFixMe
export const withMoveContextMenu = compose(
  withDefaultProps,
  observer,
  (WrappedComponent: any) => (p: PropsT) => {
    const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);

    const moveListId = getId(props.moveList);
    const targetMoveLists = props.movesClipboard.targetMoveLists;

    const targetMoveListsForMoving = props.moveLists.filter(
      x => moveListId != getId(x)
    );

    const moveContextMenu = (
      <Widgets.MoveContextMenu
        targetMoveLists={targetMoveLists || []}
        targetMoveListsForMoving={targetMoveListsForMoving}
        movesClipboard={props.movesClipboard}
        isOwnerOfMoveList={props.moveList && props.isOwner(props.moveList)}
      />
    );

    return <WrappedComponent moveContextMenu={moveContextMenu} {...props} />;
  }
);
