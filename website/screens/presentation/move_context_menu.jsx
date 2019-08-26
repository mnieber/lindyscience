// @flow

import * as React from "react";
import { Menu, Item, Submenu } from "react-contexify";

import type { MoveListT } from "move_lists/types";

type MoveContextMenuPropsT = {
  targetMoveLists: Array<MoveListT>,
  targetMoveListsForMoving: Array<MoveListT>,
  shareMovesToList: MoveListT => boolean,
  moveMovesToList: MoveListT => boolean,
  copyNamesToClipboard: MoveListT => void,
  copyLinksToClipboard: MoveListT => void,
};

export function MoveContextMenu(props: MoveContextMenuPropsT) {
  function _shareToList(e) {
    props.shareMovesToList(e.props);
  }

  const shareToListMenuItems = props.targetMoveLists.map((moveList, idx) => {
    return (
      <Item onClick={_shareToList} key={moveList.id} data={moveList}>
        {moveList.name}
      </Item>
    );
  });

  function _moveToList(e) {
    props.moveMovesToList(e.props);
  }

  function _copyNamesToClipboard(e) {
    props.copyNamesToClipboard(e.props);
  }

  function _copyLinksToClipboard(e) {
    props.copyLinksToClipboard(e.props);
  }

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
    <Item onClick={props.copyNamesToClipboard} key={1}>
      Copy names
    </Item>,
    <Item onClick={props.copyLinksToClipboard} key={2}>
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
}
