// @flow

import * as React from 'react'
import {
  Menu, Item, Separator, Submenu
} from 'react-contexify';

import type {
  MoveListT
} from 'moves/types'


type MoveContextMenuPropsT = {
  targetMoveLists: Array<MoveListT>,
  shareMoveToList: (MoveListT) => void,
  moveMoveToList: (MoveListT) => void,
};

export function MoveContextMenu(props: MoveContextMenuPropsT) {
  function _shareToList(e) {
    props.shareMoveToList(e.props);
  }

  const shareToListMenuItems = props.targetMoveLists.map((moveList, idx) => {
    return (
      <Item
        onClick={_shareToList}
        key={moveList.id}
        data={moveList}
      >
      {moveList.name}
      </Item>
    )
  })

  function _moveToList(e) {
    props.moveMoveToList(e.props);
  }

  const moveToListMenuItems = props.targetMoveLists.map((moveList, idx) => {
    return (
      <Item
        onClick={_moveToList}
        key={moveList.id}
        data={moveList}
      >
      {moveList.name}
      </Item>
    )
  })

  return (
    <Menu id="moveContextMenu">
      <Item onClick={()=>{}} >
        Trash
      </Item>
      <Submenu label="Share to list">
        {shareToListMenuItems}
      </Submenu>
      <Submenu label="Move to list">
        {moveToListMenuItems}
      </Submenu>
    </Menu>
  );
}
