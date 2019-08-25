// @flow

import * as React from "react";
import classnames from "classnames";
import { Menu, MenuProvider } from "react-contexify";
import { handleSelectionKeys, scrollIntoView, getId } from "app/utils";
import KeyboardEventHandler from "react-keyboard-event-handler";
import {
  useDragging,
  createDragHandlers,
} from "move_lists/bvrs/drag_behaviours";

import type { DraggingBvrT } from "move_lists/bvrs/drag_behaviours";
import type { MoveT } from "moves/types";
import type { UUID } from "kernel/types";

// MoveList

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

type ClickHandlersT = {|
  handleMouseDown: Function,
  handleMouseUp: Function,
|};

function createClickHandlers(
  selectMoveById: (UUID, boolean, boolean) => void,
  props: MoveListPropsT
): ClickHandlersT {
  const [swallowMouseUp: boolean, setSwallowMouseUp] = React.useState(false);

  function handleMouseDown(e, moveId) {
    if (e.button == 0 && !props.selectedMoveIds.includes(moveId)) {
      selectMoveById(moveId, e.shiftKey, e.ctrlKey);
      setSwallowMouseUp(true);
    }
  }

  function handleMouseUp(e, moveId) {
    if (
      e.button == 0 &&
      !swallowMouseUp &&
      (!e.ctrlKey || props.selectedMoveIds.includes(moveId))
    ) {
      selectMoveById(moveId, e.shiftKey, e.ctrlKey);
    }
    setSwallowMouseUp(false);
  }

  return {
    handleMouseUp,
    handleMouseDown,
  };
}

type MoveListPropsT = {|
  isOwner: boolean,
  moves: Array<MoveT>,
  createHostedPanels: UUID => any,
  selectedMoveIds: Array<UUID>,
  highlightedMove: ?MoveT,
  selectMoveById: (id: UUID, isShift: boolean, isCtrl: boolean) => void,
  moveContextMenu: any,
  onDrop: (sourceIds: Array<UUID>, targetId: UUID, isBefore: boolean) => void,
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
    ? createDragHandlers(draggingBvr, props.onDrop)
    : undefined;
  const keyHandlers = createKeyHandlers(selectMoveById, props);
  const clickHandlers = createClickHandlers(selectMoveById, props);
  const highlightedMoveId = getId(props.highlightedMove);

  const moveNodes = props.moves.map((move, idx) => {
    const hostedPanels = props.createHostedPanels(move.id);

    return (
      <div
        className={classnames({
          moveList__item: true,
          "moveList__item--selected": props.selectedMoveIds.includes(move.id),
          "moveList__item--highlighted": move.id == highlightedMoveId,
          "moveList__item--drag_before":
            draggingBvr.isBefore && draggingBvr.draggingOverId == move.id,
          "moveList__item--drag_after":
            !draggingBvr.isBefore && draggingBvr.draggingOverId == move.id,
        })}
        id={move.id}
        key={idx}
        onMouseDown={e => clickHandlers.handleMouseDown(e, move.id)}
        onMouseUp={e => clickHandlers.handleMouseUp(e, move.id)}
        draggable={true}
        onDragStart={e => dragHandlers && dragHandlers.handleDragStart(move.id)}
        onDragOver={e =>
          dragHandlers && dragHandlers.handleDragOver(e, move.id)
        }
        onDragEnd={e => dragHandlers && dragHandlers.handleDragEnd()}
        onDrop={e => {
          const payloadIds = props.moves
            .map(x => x.id)
            .filter(x => props.selectedMoveIds.includes(x));
          dragHandlers && dragHandlers.handleDrop(payloadIds, move.id);
        }}
      >
        {move.name}
        {hostedPanels}
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
