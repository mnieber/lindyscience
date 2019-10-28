// @flow

import * as React from "react";
import { observer } from "mobx-react";

import { getId } from "app/utils";
import { MovesContainer } from "screens/moves_container/moves_container";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { Highlight } from "facets/generic/highlight";
import Widgets from "screens/presentation/index";

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////

type MoveContextMenuHOCPropsT = {
  movesCtr: MovesContainer,
  moveListsCtr: MoveListsContainer,
};

export const withMoveContextMenu = (WrappedComponent: any) =>
  observer((props: MoveContextMenuHOCPropsT) => {
    const moveLists = props.moveListsCtr.outputs.display;
    const moveListId = Highlight.get(props.moveListsCtr).id;

    const targetMoveLists = props.movesCtr.clipboard.targetMoveLists;

    const targetMoveListsForMoving = moveLists.filter(
      x => moveListId != getId(x)
    );

    const moveContextMenu = (
      <Widgets.MoveContextMenu
        targetMoveLists={targetMoveLists || []}
        targetMoveListsForMoving={targetMoveListsForMoving}
        movesCtr={props.movesCtr}
      />
    );

    return <WrappedComponent moveContextMenu={moveContextMenu} {...props} />;
  });
