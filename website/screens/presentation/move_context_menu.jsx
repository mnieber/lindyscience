// @flow

import * as React from "react";
import { Menu, Item, Submenu } from "react-contexify";
import { observer } from "mobx-react";
import jQuery from "jquery";

import { getId } from "app/utils";
import { Clipboard } from "screens/moves_container/facets/clipboard";
import type { MoveListT } from "move_lists/types";

type MoveContextMenuPropsT = {
  targetMoveLists: Array<MoveListT>,
  targetMoveListsForMoving: Array<MoveListT>,
  movesClipboard: Clipboard,
  isOwnerOfMoveList: boolean,
};

export const MoveContextMenu = observer((props: MoveContextMenuPropsT) => {
  function _shareToList(e) {
    props.movesClipboard.shareToList(e.props);
  }

  function _moveToList(e) {
    props.movesClipboard.moveToList(e.props);
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
      const targetMoveListIds = props.targetMoveLists.map(getId);
      const postfix = targetMoveListIds.includes(moveList.id) ? "" : " *";
      return (
        <Item onClick={_moveToList} key={moveList.id} data={moveList}>
          {moveList.name + postfix}
        </Item>
      );
    }
  );

  const exportMenuItems = [
    <Item onClick={() => props.movesClipboard.copyNames()} key={1}>
      Copy names
    </Item>,
    <Item onClick={() => props.movesClipboard.copyLinks()} key={2}>
      Copy links
    </Item>,
  ];

  return (
    <Menu
      id="moveContextMenu"
      classname="bg-white"
      onShown={() => jQuery(".movePanel").toggleClass("zminus1", true)}
      onHidden={() => jQuery(".movePanel").toggleClass("zminus1", false)}
    >
      <Submenu label="Export">{exportMenuItems}</Submenu>
      <Submenu label="Share to list">{shareToListMenuItems}</Submenu>
      {props.isOwnerOfMoveList && (
        <Submenu label="Move to list">{moveToListMenuItems}</Submenu>
      )}
      {props.isOwnerOfMoveList && (
        <Item onClick={() => props.movesClipboard.moveToTrash()} key={1}>
          Move to trash
        </Item>
      )}
    </Menu>
  );
});
