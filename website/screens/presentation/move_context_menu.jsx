// @flow

import * as React from "react";
import { Menu, Item, Submenu } from "react-contexify";
import { observer } from "mobx-react";

import { MovesContainer } from "screens/moves_container/moves_container";
import type { MoveListT } from "move_lists/types";

type MoveContextMenuPropsT = {
  targetMoveLists: Array<MoveListT>,
  targetMoveListsForMoving: Array<MoveListT>,
  movesCtr: MovesContainer,
};

export const MoveContextMenu = observer((props: MoveContextMenuPropsT) => {
  function _shareToList(e) {
    props.movesCtr.clipboard.shareToList(e.props);
  }

  function _moveToList(e) {
    props.movesCtr.clipboard.moveToList(e.props);
  }

  const shareToListMenuItems = props.targetMoveLists.map((moveList, idx) => {
    return (
      <Item onClick={_shareToList} key={moveList.id} data={moveList}>
        {moveList.name}
      </Item>
    );
  });

  const moveToListMenuItems = props.targetMoveListsForMoving.map(
    (moveList, idx) => {
      const postfix = props.targetMoveLists.includes(moveList) ? "" : " *";
      return (
        <Item onClick={_moveToList} key={moveList.id} data={moveList}>
          {moveList.name + postfix}
        </Item>
      );
    }
  );

  const exportMenuItems = [
    <Item onClick={() => props.movesCtr.clipboard.copyNames()} key={1}>
      Copy names
    </Item>,
    <Item onClick={() => props.movesCtr.clipboard.copyLinks()} key={2}>
      Copy links
    </Item>,
  ];

  return (
    <Menu id="moveContextMenu">
      <Submenu label="Export">{exportMenuItems}</Submenu>
      <Submenu label="Share to list">{shareToListMenuItems}</Submenu>
      <Submenu label="Move to list">{moveToListMenuItems}</Submenu>
    </Menu>
  );
});

