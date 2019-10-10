// @flow

import * as React from "react";
import { compose } from "redux";
import Widgets from "screens/presentation/index";
import { MoveList } from "move_lists/presentation/movelist";
import { getId } from "app/utils";
import { isNone } from "utils/utils";

import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";
import type { TagT } from "tags/types";
import type { MoveT } from "moves/types";
import type { MoveByIdT } from "moves/types";
import type { MoveListT } from "move_lists/types";
import type { MoveCrudBvrsT, MoveListCrudBvrsT } from "screens/types";
import type { MoveClipboardBvrT } from "screens/bvrs/move_clipboard_behaviours";
import type { SelectItemsBvrT } from "screens/bvrs/move_selection_behaviours";
import type { DraggingBvrT } from "move_lists/bvrs/drag_behaviours";

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////

type IsOwnerHOCPropsT = {
  moveList: ?MoveListT,
  userProfile: UserProfileT,
};

const withIsOwner = (WrappedComponent: any) => (props: IsOwnerHOCPropsT) => {
  const isOwner =
    !!props.moveList &&
    !!props.userProfile &&
    props.userProfile.userId == props.moveList.ownerId;

  return <WrappedComponent isOwner={isOwner} {...props} />;
};

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////

type MoveListPickerHOCPropsT = {
  moveList: ?MoveListT,
  moveLists: Array<MoveListT>,
  selectMoveListById: (id: UUID) => void,
  moveListCrudBvrs: MoveListCrudBvrsT,
};

const withMoveListPicker = (WrappedComponent: any) => (
  props: MoveListPickerHOCPropsT
) => {
  const defaultMoveListId = props.moveList ? props.moveList.id : "";
  const moveListPicker = (
    <Widgets.MoveListPicker
      key={defaultMoveListId}
      className=""
      moveLists={props.moveLists}
      defaultMoveListId={defaultMoveListId}
      selectMoveListById={props.selectMoveListById}
      createMoveList={props.moveListCrudBvrs.editMoveListBvr.addNewItem}
    />
  );

  return <WrappedComponent moveListPicker={moveListPicker} {...props} />;
};

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////

type MoveListPlayerHOCPropsT = {
  selectMovesBvr: SelectItemsBvrT<MoveT>,
  playMove: MoveT => void,
};

const withMoveListPlayerBtns = (WrappedComponent: any) => (
  props: MoveListPlayerHOCPropsT
) => {
  const moveListPlayerBtns = (
    <Widgets.MoveListPlayer
      moves={props.selectMovesBvr.selectedItems}
      playMove={props.playMove}
      className=""
    />
  );

  return (
    <WrappedComponent moveListPlayerBtns={moveListPlayerBtns} {...props} />
  );
};

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////

type MoveListHeaderHOCPropsT = {
  setIsFilterEnabled: boolean => void,
  moveCrudBvrs: MoveCrudBvrsT,
};

const withMoveListHeaderBtns = (WrappedComponent: any) => (
  props: MoveListHeaderHOCPropsT
) => {
  const moveListHeaderBtns = (
    <Widgets.MoveListHeader
      addNewMove={() => {
        props.setIsFilterEnabled(false);
        props.moveCrudBvrs.editMoveBvr.addNewItem({});
      }}
      className="ml-2"
    />
  );

  return (
    <WrappedComponent moveListHeaderBtns={moveListHeaderBtns} {...props} />
  );
};

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////

type MoveListFilterHOCPropsT = {
  filterMoves: (Array<TagT>, Array<string>) => void,
  moveTags: Array<TagT>,
  isFilterEnabled: boolean,
  setIsFilterEnabled: boolean => void,
};

const withMoveListFilter = (WrappedComponent: any) => (
  props: MoveListFilterHOCPropsT
) => {
  const moveListFilter = (
    <Widgets.MoveListFilter
      className=""
      filterMoves={props.filterMoves}
      moveTags={props.moveTags}
      isFilterEnabled={props.isFilterEnabled}
      setIsFilterEnabled={props.setIsFilterEnabled}
    />
  );

  return <WrappedComponent moveListFilter={moveListFilter} {...props} />;
};

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////

type MoveContextMenuHOCPropsT = {
  moveList: ?MoveListT,
  moveLists: Array<MoveListT>,
  moveClipboardBvr: MoveClipboardBvrT,
  copyNamesToClipboard: MoveListT => void,
  copyLinksToClipboard: MoveListT => void,
};

const withMoveContextMenu = (WrappedComponent: any) => (
  props: MoveContextMenuHOCPropsT
) => {
  const moveMovesToList = targetMoveList => {
    return (
      !!props.moveList &&
      props.moveClipboardBvr.moveToList(props.moveList, targetMoveList)
    );
  };

  const targetMoveListsForMoving = props.moveLists.filter(
    x => getId(props.moveList) != getId(x)
  );

  const moveContextMenu = (
    <Widgets.MoveContextMenu
      targetMoveLists={props.moveClipboardBvr.targetMoveLists}
      targetMoveListsForMoving={targetMoveListsForMoving}
      shareMovesToList={props.moveClipboardBvr.shareToList}
      moveMovesToList={moveMovesToList}
      copyNamesToClipboard={props.copyNamesToClipboard}
      copyLinksToClipboard={props.copyLinksToClipboard}
    />
  );

  return <WrappedComponent moveContextMenu={moveContextMenu} {...props} />;
};

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////

type MoveListWidgetHOCPropsT = {
  moveById: MoveByIdT,
  selectMovesBvr: SelectItemsBvrT<MoveT>,
  isOwner: boolean,
  moves: Array<MoveT>,
  highlightedMove: ?MoveT,
  draggingBvr: DraggingBvrT,
  moveContextMenu: any,
};

const withMoveListWidget = (WrappedComponent: any) => (
  props: MoveListWidgetHOCPropsT
) => {
  const refs = {};

  const createHostedPanels = moveId => {
    const move = props.moveById[moveId] || [];
    return isNone(move.link) || move.link == "" ? undefined : " (*)";
  };

  const selectedMoveIds = props.selectMovesBvr.selectedItems.map(x => x.id);

  const moveListWidget = (
    <Widgets.MoveList
      refs={refs}
      className=""
      isOwner={props.isOwner}
      createHostedPanels={createHostedPanels}
      selectMoveById={props.selectMovesBvr.select}
      moves={props.moves}
      selectedMoveIds={selectedMoveIds}
      highlightedMove={props.highlightedMove}
      draggingBvr={props.draggingBvr}
      moveContextMenu={props.moveContextMenu}
    />
  );

  return <WrappedComponent moveListWidget={moveListWidget} {...props} />;
};

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////

export type MoveListPanelPropsT = MoveListPickerHOCPropsT &
  IsOwnerHOCPropsT &
  MoveListPlayerHOCPropsT &
  MoveListHeaderHOCPropsT &
  MoveListFilterHOCPropsT &
  MoveContextMenuHOCPropsT &
  MoveListWidgetHOCPropsT & {
    isOwner: boolean,
    moveListPicker: any,
    moveListPlayerBtns: any,
    moveListHeaderBtns: any,
    moveListFilter: any,
    moveListWidget: any,
    children: any,
  };

function MoveListPanel_(props: MoveListPanelPropsT) {
  return (
    <div className="moveListPanel flexrow">
      <div className="moveListPanel__inner flexcol">
        {props.moveListPicker}
        {props.moveListFilter}
        <div className="flexrow w-full my-4">
          {props.moveListPlayerBtns}
          {props.isOwner && props.moveListHeaderBtns}
        </div>
        {props.moveListWidget}
      </div>
      <div className="movePanel pl-4 w-full">{props.children}</div>
    </div>
  );
}

export const MoveListPanel = compose(
  withIsOwner,
  withMoveListPicker,
  withMoveListPlayerBtns,
  withMoveListHeaderBtns,
  withMoveListFilter,
  withMoveContextMenu,
  withMoveListWidget
)(MoveListPanel_);
