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
};

const withMoveListPicker = (WrappedComponent: any) => (
  props: MoveListPickerHOCPropsT
) => {
  const moveListPicker = (
    <Widgets.MoveListPicker
      className="mb-4"
      moveLists={props.moveLists}
      defaultMoveListId={props.moveList ? props.moveList.id : ""}
      selectMoveListById={props.selectMoveListById}
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

const withMoveListPlayer = (WrappedComponent: any) => (
  props: MoveListPlayerHOCPropsT
) => {
  const moveListPlayer = (
    <Widgets.MoveListPlayer
      moves={props.selectMovesBvr.selectedItems}
      playMove={props.playMove}
      className=""
    />
  );

  return <WrappedComponent moveListPlayer={moveListPlayer} {...props} />;
};

///////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////

type MoveListHeaderHOCPropsT = {
  setIsFilterEnabled: boolean => void,
  moveCrudBvrs: MoveCrudBvrsT,
};

const withMoveListHeader = (WrappedComponent: any) => (
  props: MoveListHeaderHOCPropsT
) => {
  const moveListHeader = (
    <Widgets.MoveListHeader
      addNewMove={() => {
        props.setIsFilterEnabled(false);
        props.moveCrudBvrs.editMoveBvr.addNewItem();
      }}
      className=""
    />
  );

  return <WrappedComponent moveListHeader={moveListHeader} {...props} />;
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
      className="mb-4"
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

type MoveListPanelButtonsHOCPropsT = {
  moveListCrudBvrs: MoveListCrudBvrsT,
  userProfile: UserProfileT,
  moveList: ?MoveListT,
  setIsFollowing: boolean => void,
};

const withMoveListPanelButtons = (WrappedComponent: any) => (
  props: MoveListPanelButtonsHOCPropsT
) => {
  const newMoveListBtn = (
    <div
      className={"button button--wide"}
      onClick={props.moveListCrudBvrs.editMoveListBvr.addNewItem}
      key={1}
    >
      New move list
    </div>
  );

  const isFollowing =
    !!props.moveList &&
    !!props.userProfile &&
    props.userProfile.moveListIds.includes(props.moveList.id);

  const followMoveListBtn = (
    <div
      className={"button button--wide ml-2"}
      onClick={() => props.setIsFollowing(!isFollowing)}
      key={2}
    >
      {isFollowing ? "Stop following" : "Follow"}
    </div>
  );

  const moveListPanelButtons = (
    <div className={"move__name flexrow flex-wrap"}>
      {props.userProfile && newMoveListBtn}
      {props.userProfile && followMoveListBtn}
    </div>
  );

  return (
    <WrappedComponent moveListPanelButtons={moveListPanelButtons} {...props} />
  );
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
  MoveListWidgetHOCPropsT &
  MoveListPanelButtonsHOCPropsT &
  MoveListPanelButtonsHOCPropsT & {
    isOwner: boolean,
    moveListPicker: any,
    moveListPlayer: any,
    moveListHeader: any,
    moveListFilter: any,
    moveListWidget: any,
    moveListPanelButtons: any,
    children: any,
  };

function MoveListPanel_(props: MoveListPanelPropsT) {
  return (
    <div className="moveListPanel flexrow">
      <div className="moveListPanel__inner flexcol">
        {props.moveListPicker}
        {props.moveListPanelButtons}
        {props.moveListFilter}
        {props.moveListPlayer}
        {true && props.isOwner && props.moveListHeader}
        {props.moveListWidget}
      </div>
      <div className="movePanel pl-4 w-4/5">{props.children}</div>
    </div>
  );
}

export const MoveListPanel = compose(
  withIsOwner,
  withMoveListPicker,
  withMoveListPlayer,
  withMoveListHeader,
  withMoveListFilter,
  withMoveContextMenu,
  withMoveListWidget,
  withMoveListPanelButtons
)(MoveListPanel_);
