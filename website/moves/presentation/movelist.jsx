// @flow

import * as React from "react";
import classnames from "classnames";
import { Menu, MenuProvider } from "react-contexify";
import { handleSelectionKeys, scrollIntoView, getId } from "app/utils";
import KeyboardEventHandler from "react-keyboard-event-handler";
import type { MoveT, VideoLinksByIdT } from "moves/types";
import type { UUID } from "app/types";

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

type DragHandlersT = {|
  handleDragStart: Function,
  handleDrop: Function,
  handleDragOver: Function,
  handleDragEnd: Function,
|};

function createDragHandlers(
  draggingBvr: DraggingBvrT,
  props: MoveListPropsT
): DragHandlersT {
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
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleDragEnd,
  };
}

type KeyHandlersT = {|
  handleKeyDown: Function,
|};

function createKeyHandlers(
  selectMoveById: (UUID, boolean, boolean) => void,
  props: MoveListPropsT
): KeyHandlersT {
  function handleKeyDown(key, e) {
    if (props.highlightedMove) {
      e.target.id == "moveList" &&
        handleSelectionKeys(
          key,
          e,
          props.moves,
          props.highlightedMove.id,
          // TODO support shift selection with keyboard (e.shiftKey)
          // Note: in that case, anchor != highlight
          id => selectMoveById(id, false, false)
        );
    }
  }

  return {
    handleKeyDown,
  };
}

type MoveListPropsT = {|
  isOwner: boolean,
  moves: Array<MoveT>,
  videoLinksByMoveId: VideoLinksByIdT,
  selectedMoveIds: Array<UUID>,
  highlightedMove: ?MoveT,
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
  const dragHandlers = props.isOwner
    ? createDragHandlers(draggingBvr, props)
    : undefined;
  const keyHandlers = createKeyHandlers(selectMoveById, props);
  const highlightedMoveId = getId(props.highlightedMove);

  const moveNodes = props.moves.map((move, idx) => {
    const videoLinks = props.videoLinksByMoveId[move.id] || [];
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
          "moveList__item--highlighted": move.id == highlightedMoveId,
          "moveList__item--drag_before":
            draggingBvr.isBefore && draggingBvr.draggingOverMoveId == move.id,
          "moveList__item--drag_after":
            !draggingBvr.isBefore && draggingBvr.draggingOverMoveId == move.id,
        })}
        id={move.id}
        key={idx}
        onMouseDown={e => {
          if (
            e.button == 0 ||
            !(
              props.selectedMoveIds.length &&
              props.selectedMoveIds.includes(move.id)
            )
          ) {
            selectMoveById(move.id, e.shiftKey, e.ctrlKey);
          }
        }}
        draggable={true}
        onDragStart={e => dragHandlers && dragHandlers.handleDragStart(move.id)}
        onDragOver={e =>
          dragHandlers && dragHandlers.handleDragOver(e, move.id)
        }
        onDragEnd={e => dragHandlers && dragHandlers.handleDragEnd(e, move.id)}
        onDrop={e => {
          dragHandlers && dragHandlers.handleDrop(move.id);
        }}
      >
        {move.name}
        {videoLinkDiv}
      </div>
    );
  });

  return (
    <KeyboardEventHandler
      handleKeys={["up", "down"]}
      onKeyEvent={keyHandlers.handleKeyDown}
    >
      <div
        className={classnames(props.className, "moveList")}
        ref={props.refs.moveListRef}
        tabIndex={123}
        id="moveList"
      >
        <MenuProvider id="moveContextMenu">{moveNodes}</MenuProvider>
        {props.moveContextMenu}
      </div>
    </KeyboardEventHandler>
  );
}
