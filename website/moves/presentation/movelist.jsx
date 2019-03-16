// @flow

import * as React from "react";
import classnames from "classnames";
import { Menu, Item, Separator, Submenu, MenuProvider } from "react-contexify";
import { makeSlugidMatcher, findMoveBySlugid } from "moves/utils";
import { handleSelectionKeys, scrollIntoView } from "app/utils";
import type { MoveT, VideoLinksByIdT } from "moves/types";
import type { UUID, SlugidT } from "app/types";

// MoveList

type DraggingBvrT = {|
  draggingOverMoveId: UUID,
  isBefore: boolean,
  setDraggingOverMoveId: Function, // (Array<UUID | boolean>) => void
  dragSourceMoveId: UUID,
  setDragSourceMoveId: UUID => void,
|};

function useDragging(): DraggingBvrT {
  const [
    [draggingOverMoveId: UUID, isBefore: boolean],
    setDraggingOverMoveId,
  ] = React.useState(["", false]);
  const [dragSourceMoveId: UUID, setDragSourceMoveId] = React.useState("");

  return {
    draggingOverMoveId,
    isBefore,
    setDraggingOverMoveId,
    dragSourceMoveId,
    setDragSourceMoveId,
  };
}

type HandlersT = {|
  handleKeyDown: Function,
  handleDragStart: Function,
  handleDrop: Function,
  handleDragOver: Function,
  handleDragEnd: Function,
|};

function createHandlers(
  draggingBvr: DraggingBvrT,
  selectMoveById: (UUID, boolean, boolean) => void,
  props: MoveListPropsT
): HandlersT {
  function handleKeyDown(e) {
    const highlightedMove = findMoveBySlugid(
      props.moves,
      props.highlightedMoveSlugid
    );
    handleSelectionKeys(
      e,
      "moveList",
      props.moves,
      highlightedMove.id,
      // TODO support shift selection with keyboard (e.shiftKey)
      // Note: in that case, anchor != highlight
      id => selectMoveById(id, false, false)
    );
  }

  function handleDragStart(sourceMoveId) {
    draggingBvr.setDragSourceMoveId(sourceMoveId);
  }

  function handleDragEnd(sourceMoveId) {
    draggingBvr.setDraggingOverMoveId([undefined, false]);
  }

  function handleDrop(targetMoveId) {
    props.onDrop(
      draggingBvr.dragSourceMoveId,
      targetMoveId,
      draggingBvr.isBefore
    );
    draggingBvr.setDraggingOverMoveId([undefined, false]);
  }

  function handleDragOver(e, moveId) {
    e.preventDefault();
    const boundingRect = e.target.getBoundingClientRect();
    const height = boundingRect.bottom - boundingRect.top;
    const isBefore = e.clientY - boundingRect.top < 0.5 * height;
    draggingBvr.setDraggingOverMoveId([moveId, isBefore]);
  }

  return {
    handleKeyDown,
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleDragEnd,
  };
}

type MoveListPropsT = {|
  moves: Array<MoveT>,
  videoLinksByMoveId: VideoLinksByIdT,
  selectedMoveIds: Array<UUID>,
  highlightedMoveSlugid: SlugidT,
  selectMoveById: (id: UUID, isShift: boolean, isCtrl: boolean) => void,
  moveContextMenu: any,
  onDrop: (sourceId: UUID, targetId: UUID, isBefore: boolean) => void,
  className?: string,
  refs: any,
|};

export function MoveList(props: MoveListPropsT) {
  props.refs.moveListRef = React.useRef(null);

  const selectMoveById = (moveId: UUID, isShift: boolean, isCtrl: boolean) => {
    scrollIntoView(document.getElementById(moveId));
    props.selectMoveById(moveId, isShift, isCtrl);
  };

  const draggingBvr: DraggingBvrT = useDragging();
  const handlers = createHandlers(draggingBvr, selectMoveById, props);
  const slugidMatcher = makeSlugidMatcher(props.highlightedMoveSlugid);

  const moveNodes = props.moves.map((move, idx) => {
    const videoLinks = props.videoLinksByMoveId[move.id];
    const videoLinkDiv =
      videoLinks && videoLinks.length ? (
        <a className="ml-2" href={videoLinks[0].url} target="blank">
          VIDEO
        </a>
      ) : (
        undefined
      );

    return (
      <div
        className={classnames({
          moveList__item: true,
          "moveList__item--selected": props.selectedMoveIds.includes(move.id),
          "moveList__item--highlighted": slugidMatcher(move),
          "moveList__item--drag_before":
            draggingBvr.isBefore && draggingBvr.draggingOverMoveId == move.id,
          "moveList__item--drag_after":
            !draggingBvr.isBefore && draggingBvr.draggingOverMoveId == move.id,
        })}
        id={move.id}
        key={idx}
        onMouseDown={e => {
          if (e.button == 0) {
            selectMoveById(move.id, e.shiftKey, e.ctrlKey);
          }
        }}
        draggable={true}
        onDragStart={e => handlers.handleDragStart(move.id)}
        onDragOver={e => handlers.handleDragOver(e, move.id)}
        onDragEnd={e => handlers.handleDragEnd(e, move.id)}
        onDrop={e => {
          handlers.handleDrop(move.id);
        }}
      >
        {move.name}
        {videoLinkDiv}
      </div>
    );
  });

  return (
    <div
      className={classnames(props.className, "moveList")}
      ref={props.refs.moveListRef}
      id="moveList"
      tabIndex={123}
      onKeyDown={handlers.handleKeyDown}
    >
      <MenuProvider id="moveContextMenu">{moveNodes}</MenuProvider>
      {props.moveContextMenu}
    </div>
  );
}
