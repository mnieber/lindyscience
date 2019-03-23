// @flow

import * as React from "react";
import Widgets from "moves/presentation/index";
import { MoveList } from "moves/presentation/movelist";
import type { UUID, UserProfileT, SlugidT, TagT } from "app/types";
import type {
  MoveListT,
  VideoLinksByIdT,
  MoveT,
  MoveCrudBvrsT,
  MoveListCrudBvrsT,
} from "moves/types";
import type { MoveClipboardBvrT } from "moves/containers/move_clipboard_behaviours";
import type { SelectItemsBvrT } from "moves/containers/move_selection_behaviours";

type HandlersT = {
  onDrop: (sourceMoveId: UUID, targetId: UUID, isBefore: boolean) => void,
};

function createHandlers(moves: Array<MoveT>, bvrs: MoveCrudBvrsT): HandlersT {
  const onDrop = (sourceMoveId, targetMoveId, isBefore) => {
    if (bvrs.newMoveBvr.newItem && bvrs.newMoveBvr.newItem.id != sourceMoveId) {
      bvrs.insertMovesBvr.insertDirectly(
        [sourceMoveId],
        targetMoveId,
        isBefore
      );
    }
  };

  return {
    onDrop,
  };
}

export type MoveListPanelPropsT = {
  userProfile: UserProfileT,
  videoLinksByMoveId: VideoLinksByIdT,
  isFilterEnabled: boolean,
  setIsFilterEnabled: boolean => void,
  moves: Array<MoveT>,
  playMoves: Function,
  moveCrudBvrs: MoveCrudBvrsT,
  moveListCrudBvrs: MoveListCrudBvrsT,
  moveClipboardBvr: MoveClipboardBvrT,
  selectMovesBvr: SelectItemsBvrT<MoveT>,
  moveTags: Array<TagT>,
  moveLists: Array<MoveListT>,
  highlightedMove: ?MoveT,
  moveList: ?MoveListT,
  filterMoves: (Array<TagT>, Array<string>) => void,
  selectMoveListById: (id: UUID) => void,
  children: any,
};

export function MoveListPanel(props: MoveListPanelPropsT) {
  const refs = {};
  const handlers: HandlersT = createHandlers(props.moves, props.moveCrudBvrs);

  const userId = props.userProfile ? props.userProfile.userId : -1;

  const moveListPicker = (
    <Widgets.MoveListPicker
      className="mb-4"
      moveLists={props.moveLists}
      defaultMoveListId={props.moveList ? props.moveList.id : ""}
      selectMoveListById={props.selectMoveListById}
    />
  );

  const moveListHeader = (
    <Widgets.MoveListHeader
      addNewMove={() => {
        props.setIsFilterEnabled(false);
        props.moveCrudBvrs.newMoveBvr.addNewItem();
      }}
      playMoves={props.playMoves}
      className=""
    />
  );

  const moveListFilter = (
    <Widgets.MoveListFilter
      className="mb-4"
      filterMoves={props.filterMoves}
      moveTags={props.moveTags}
      isFilterEnabled={props.isFilterEnabled}
      setIsFilterEnabled={props.setIsFilterEnabled}
    />
  );

  const moveMovesToList = targetMoveList => {
    return (
      !!props.moveList &&
      props.moveClipboardBvr.moveToList(props.moveList, targetMoveList)
    );
  };

  const moveContextMenu = (
    <Widgets.MoveContextMenu
      targetMoveLists={props.moveClipboardBvr.targetMoveLists}
      shareMovesToList={props.moveClipboardBvr.shareToList}
      moveMovesToList={moveMovesToList}
    />
  );

  const isOwner = !!props.moveList && userId == props.moveList.ownerId;

  const moveList = (
    <Widgets.MoveList
      refs={refs}
      className=""
      isOwner={isOwner}
      videoLinksByMoveId={props.videoLinksByMoveId}
      selectMoveById={props.selectMovesBvr.select}
      moves={props.moves}
      selectedMoveIds={props.selectMovesBvr.selectedItems.map(x => x.id)}
      highlightedMove={props.highlightedMove}
      onDrop={handlers.onDrop}
      moveContextMenu={moveContextMenu}
    />
  );

  const newMoveListBtn = (
    <div
      className={"button button--wide"}
      onClick={props.moveListCrudBvrs.newMoveListBvr.addNewItem}
      key={1}
    >
      New move list
    </div>
  );

  const buttonsDiv = (
    <div className={"move__name flexrow flex-wrap"}>
      {props.userProfile && newMoveListBtn}
    </div>
  );

  return (
    <div className="moveListPanel flexrow">
      <div className="moveListPanel__inner w-1/5 flexcol">
        {buttonsDiv}
        {moveListPicker}
        {isOwner && moveListHeader}
        {moveListFilter}
        {moveList}
      </div>
      <div className="movePanel pl-4 w-4/5">{props.children}</div>
    </div>
  );
}
