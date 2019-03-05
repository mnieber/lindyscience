// @flow

import * as React from 'react'
import { useRef } from 'react'
import { MoveList } from 'moves/presentation/movelist';
import { makeMoveListUrl } from 'moves/utils';
import { StaticMoveList } from 'moves/presentation/static_movelist';
import { MoveListFilter, MoveListPicker } from 'moves/presentation/movelist_filter';
import { MoveListHeader } from 'moves/presentation/movelist_header';
import type {  } from 'moves/containers/move_crud_behaviours';
import type { UUID, UserProfileT, SlugidT, TagT } from 'app/types';
import type { MoveListT, VideoLinksByIdT, MoveT, MoveCrudBvrsT } from 'moves/types'


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
  bvrs: MoveCrudBvrsT,
  moveTags: Array<TagT>,
  moveLists: Array<MoveListT>,
  highlightedMoveSlugid: SlugidT,
  moveList: ?MoveListT,
  actSetMoveListFilter: Function,
  children: any,
};

export function MoveListPanel(props: MoveListPanelPropsT, context: any) {
  const handlers: HandlersT = createHandlers(props.bvrs);
  const moveListRef = useRef(null);

  const userId = props.userProfile
    ? props.userProfile.userId
    : -1;

  const moveListPicker =
    <MoveListPicker
      className="mb-4"
      moveLists={props.moveLists}
      defaultMoveListId={props.moveList ? props.moveList.id : ""}
    />

  const moveListHeader =
    <MoveListHeader
      addNewMove={props.bvrs.newMoveBvr.addNewItem}
      className="py-4"
    />

  const moveListFilter =
    <MoveListFilter
      className="mb-4"
      setMoveListFilter={props.actSetMoveListFilter}
      moveTags={props.moveTags}
      moveListUrl={props.moveList
        ? makeMoveListUrl(props.moveList)
        : ""
      }
    />

  const moveList =
    <MoveList
      ref={moveListRef}
      className=""
      videoLinksByMoveId={props.videoLinksByMoveId}
      setHighlightedMoveId={props.bvrs.newMoveBvr.setHighlightedItemId}
      moves={props.bvrs.insertMoveBvr.preview}
      highlightedMoveSlugid={props.highlightedMoveSlugid}
      onDrop={handlers.onDrop}
    />

  const staticMoveList =
    <StaticMoveList
      moves={props.bvrs.insertMoveBvr.preview}
      videoLinksByMoveId={props.videoLinksByMoveId}
      highlightedMoveSlugid={props.highlightedMoveSlugid}
      setHighlightedMoveId={props.bvrs.newMoveBvr.setHighlightedItemId}
      className=""
    />

  const showStatic = !(props.moveList && userId == props.moveList.ownerId);

  return (
    <div
      className="moveListFrame flexrow"
      onKeyDown={handlers.onKeyDown}
    >
      <div className="moveListPanel w-1/5 flexcol">
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
