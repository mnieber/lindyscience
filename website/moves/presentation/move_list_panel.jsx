// @flow

import * as React from 'react'
import { useRef } from 'react'
import Widgets from 'moves/presentation/index'
import { makeMoveListUrl } from 'moves/utils';
import type { UUID, UserProfileT, SlugidT, TagT } from 'app/types';
import type {
  MoveListT, VideoLinksByIdT, MoveT, MoveCrudBvrsT, MoveListCrudBvrsT
} from 'moves/types'


type HandlersT = {
  onDrop: Function,
  onKeyDown: Function,
};

function createHandlers(
  bvrs: MoveCrudBvrsT,
  moveListRef: any,
): HandlersT {
  const onDrop = (sourceMoveId, targetMoveId, isBefore) => {
    if (bvrs.newMoveBvr.newItem?.id != sourceMoveId) {
      bvrs.insertMoveBvr.insertDirectly(sourceMoveId, targetMoveId, isBefore);
    }
  }

  const onKeyDown = (e) => {
    const edit_e = 69;
    if(e.ctrlKey && [edit_e].indexOf(e.keyCode) > -1) {
      e.preventDefault();
      e.stopPropagation();
      if (bvrs.isEditing) {
        bvrs.saveMoveBvr.discardChanges();
        if (moveListRef.current) {
          moveListRef.current.focus();
        }
      }
      else {
        bvrs.setIsEditing(true);
      }
    }
  }

  return {
    onDrop,
    onKeyDown
  }
}

export type MoveListPanelPropsT = {
  userProfile: UserProfileT,
  videoLinksByMoveId: VideoLinksByIdT,
  moveCrudBvrs: MoveCrudBvrsT,
  moveListCrudBvrs: MoveListCrudBvrsT,
  moveTags: Array<TagT>,
  moveLists: Array<MoveListT>,
  highlightedMoveSlugid: SlugidT,
  moveList: ?MoveListT,
  actSetMoveListFilter: Function,
  children: any,
};

export function MoveListPanel(props: MoveListPanelPropsT, context: any) {
  const handlers: HandlersT = createHandlers(props.moveCrudBvrs);
  const moveListRef = useRef(null);

  const userId = props.userProfile
    ? props.userProfile.userId
    : -1;

  const moveListPicker =
    <Widgets.MoveListPicker
      className="mb-4"
      moveLists={props.moveLists}
      defaultMoveListId={props.moveList ? props.moveList.id : ""}
    />

  const moveListHeader =
    <Widgets.MoveListHeader
      addNewMove={props.moveCrudBvrs.newMoveBvr.addNewItem}
      className="py-4"
    />

  const moveListFilter =
    <Widgets.MoveListFilter
      className="mb-4"
      setMoveListFilter={props.actSetMoveListFilter}
      moveTags={props.moveTags}
      moveListUrl={props.moveList
        ? makeMoveListUrl(props.moveList)
        : ""
      }
    />

  const moveList =
    <Widgets.MoveList
      ref={moveListRef}
      className=""
      videoLinksByMoveId={props.videoLinksByMoveId}
      setHighlightedMoveId={props.moveCrudBvrs.newMoveBvr.setHighlightedItemId}
      moves={props.moveCrudBvrs.insertMoveBvr.preview}
      highlightedMoveSlugid={props.highlightedMoveSlugid}
      onDrop={handlers.onDrop}
    />

  const staticMoveList =
    <Widgets.StaticMoveList
      moves={props.moveCrudBvrs.insertMoveBvr.preview}
      videoLinksByMoveId={props.videoLinksByMoveId}
      highlightedMoveSlugid={props.highlightedMoveSlugid}
      setHighlightedMoveId={props.moveCrudBvrs.newMoveBvr.setHighlightedItemId}
      className=""
    />

  const showStatic = !(props.moveList && userId == props.moveList.ownerId);

  const newMoveListBtn =
    <div
      className={"button button--wide ml-2"}
      onClick={props.moveListCrudBvrs.newMoveListBvr.addNewItem}
      key={1}
    >
    New move list
    </div>;

  const buttonsDiv =
    <div className={"move__name flexrow flex-wrap"}>
      {newMoveListBtn}
    </div>

  return (
    <div
      className="moveListFrame flexrow"
      onKeyDown={handlers.onKeyDown}
    >
      <div className="moveListPanel w-1/5 flexcol">
        {!showStatic && buttonsDiv}
        {moveListPicker}
        {!showStatic && moveListHeader}
        {moveListFilter}
        {!showStatic && moveList}
        {showStatic && staticMoveList}
      </div>
      <div className="movePanel pl-4 w-4/5">
          {props.children}
      </div>
    </div>
  );
}
