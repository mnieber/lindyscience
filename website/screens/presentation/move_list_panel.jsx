// @flow

import * as React from "react";
import Widgets from "screens/presentation/index";
import { MoveList } from "screens/presentation/movelist";
import type { UUID } from "kernel/types";
import type { UserProfileT } from "profiles/types";
import type { TagT } from "tags/types";
import type { MoveT } from "moves/types";
import type { VideoLinksByIdT } from "videolinks/types";
import type {
  MoveListT,
  MoveCrudBvrsT,
  MoveListCrudBvrsT,
} from "screens/types";
import type { MoveClipboardBvrT } from "screens/containers/move_clipboard_behaviours";
import type { SelectItemsBvrT } from "screens/containers/move_selection_behaviours";

type HandlersT = {
  onDrop: (sourceMoveId: UUID, targetId: UUID, isBefore: boolean) => void,
};

function createHandlers(moves: Array<MoveT>, bvrs: MoveCrudBvrsT): HandlersT {
  const onDrop = (sourceMoveId, targetMoveId, isBefore) => {
    if (
      !bvrs.newMoveBvr.newItem ||
      bvrs.newMoveBvr.newItem.id != sourceMoveId
    ) {
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
  playMove: MoveT => void,
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
  copyNamesToClipboard: MoveListT => void,
  copyLinksToClipboard: MoveListT => void,
  setIsFollowing: boolean => void,
  children: any,
};

export function MoveListPanel(props: MoveListPanelPropsT) {
  const refs = {};
  const handlers: HandlersT = createHandlers(props.moves, props.moveCrudBvrs);

  const moveListPicker = (
    <Widgets.MoveListPicker
      className="mb-4"
      moveLists={props.moveLists}
      defaultMoveListId={props.moveList ? props.moveList.id : ""}
      selectMoveListById={props.selectMoveListById}
    />
  );

  const moveListPlayer = (
    <Widgets.MoveListPlayer
      moves={props.selectMovesBvr.selectedItems}
      playMove={props.playMove}
      className=""
    />
  );

  const moveListHeader = (
    <Widgets.MoveListHeader
      addNewMove={() => {
        props.setIsFilterEnabled(false);
        props.moveCrudBvrs.newMoveBvr.addNewItem();
      }}
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
      copyNamesToClipboard={props.copyNamesToClipboard}
      copyLinksToClipboard={props.copyLinksToClipboard}
    />
  );

  const isOwner =
    !!props.moveList &&
    !!props.userProfile &&
    props.userProfile.userId == props.moveList.ownerId;

  const createHostedPanels = moveId => {
    const videoLinks = props.videoLinksByMoveId[moveId] || [];
    const videoLinkDiv =
      videoLinks && videoLinks.length ? (
        <a className="ml-2" href={videoLinks[0].url} target="blank">
          VIDEO
        </a>
      ) : (
        undefined
      );
    return videoLinkDiv;
  };

  const moveList = (
    <Widgets.MoveList
      refs={refs}
      className=""
      isOwner={isOwner}
      createHostedPanels={createHostedPanels}
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

  const buttonsDiv = (
    <div className={"move__name flexrow flex-wrap"}>
      {props.userProfile && newMoveListBtn}
      {props.userProfile && followMoveListBtn}
    </div>
  );

  return (
    <div className="moveListPanel flexrow">
      <div className="moveListPanel__inner w-1/5 flexcol">
        {buttonsDiv}
        {moveListPicker}
        {moveListPlayer}
        {isOwner && moveListHeader}
        {moveListFilter}
        {moveList}
      </div>
      <div className="movePanel pl-4 w-4/5">{props.children}</div>
    </div>
  );
}
