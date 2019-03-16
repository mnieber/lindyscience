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
  onKeyDown: (e: any) => void,
};

function createHandlers(
  moves: Array<MoveT>,
  bvrs: MoveCrudBvrsT,
  moveListRef: any
): HandlersT {
  const onDrop = (sourceMoveId, targetMoveId, isBefore) => {
    if (bvrs.newMoveBvr.newItem?.id != sourceMoveId) {
      bvrs.insertMovesBvr.insertDirectly(
        [sourceMoveId],
        targetMoveId,
        isBefore
      );
    }
  };

  const onKeyDown = e => {
    const edit_e = 69;
    if (e.ctrlKey && [edit_e].indexOf(e.keyCode) > -1) {
      e.preventDefault();
      e.stopPropagation();
      if (bvrs.isEditing) {
        bvrs.saveMoveBvr.discardChanges();
        if (moveListRef && moveListRef.current) {
          moveListRef.current.focus();
        }
      } else {
        bvrs.setIsEditing(true);
      }
    }
  };

  return {
    onDrop,
    onKeyDown,
  };
}

export type MoveListPanelPropsT = {
  userProfile: UserProfileT,
  videoLinksByMoveId: VideoLinksByIdT,
  moves: Array<MoveT>,
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
  const handlers: HandlersT = createHandlers(
    props.moves,
    props.moveCrudBvrs,
    refs.moveListRef
  );

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
      addNewMove={props.moveCrudBvrs.newMoveBvr.addNewItem}
      className=""
    />
  );

  const moveListFilter = (
    <Widgets.MoveListFilter
      className="mb-4"
      filterMoves={props.filterMoves}
      moveTags={props.moveTags}
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

  const moveList = (
    <Widgets.MoveList
      refs={refs}
      className=""
      videoLinksByMoveId={props.videoLinksByMoveId}
      selectMoveById={props.selectMovesBvr.select}
      moves={props.moves}
      selectedMoveIds={props.selectMovesBvr.selectedItems.map(x => x.id)}
      highlightedMove={props.highlightedMove}
      onDrop={handlers.onDrop}
      moveContextMenu={moveContextMenu}
    />
  );

  const staticMoveList = (
    <Widgets.StaticMoveList
      refs={refs}
      moves={props.moves}
      videoLinksByMoveId={props.videoLinksByMoveId}
      highlightedMove={props.highlightedMove}
      setHighlightedMoveId={props.moveCrudBvrs.newMoveBvr.setHighlightedItemId}
      className=""
    />
  );

  const showStatic = !(props.moveList && userId == props.moveList.ownerId);

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
    <div className={"move__name flexrow flex-wrap"}>{newMoveListBtn}</div>
  );

  return (
    <div className="moveListPanel flexrow" onKeyDown={handlers.onKeyDown}>
      <div className="moveListPanel__inner w-1/5 flexcol">
        {!showStatic && buttonsDiv}
        {moveListPicker}
        {!showStatic && moveListHeader}
        {moveListFilter}
        {!showStatic && moveList}
        {showStatic && staticMoveList}
      </div>
      <div className="movePanel pl-4 w-4/5">{props.children}</div>
    </div>
  );
}
