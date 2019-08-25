// @flow

import * as React from "react";

import type { UUID } from "kernel/types";

export type DraggingBvrT = {|
  draggingOverId: UUID,
  isBefore: boolean,
  setDraggingOverId: Function, // (Array<UUID | boolean>) => void
  dragSourceId: UUID,
  setDragSourceId: UUID => void,
|};

export function useDragging(): DraggingBvrT {
  const [
    [draggingOverId: UUID, isBefore: boolean],
    setDraggingOverId,
  ] = React.useState(["", false]);
  const [dragSourceId: UUID, setDragSourceId] = React.useState("");

  return {
    draggingOverId,
    isBefore,
    setDraggingOverId,
    dragSourceId,
    setDragSourceId,
  };
}

type DragHandlersT = {|
  handleDragStart: Function,
  handleDrop: Function,
  handleDragOver: Function,
  handleDragEnd: Function,
|};

export function createDragHandlers(
  draggingBvr: DraggingBvrT,
  onDrop: (sourceId: UUID, targetId: UUID, isBefore: boolean) => void
): DragHandlersT {
  function handleDragStart(sourceId) {
    draggingBvr.setDragSourceId(sourceId);
  }

  function handleDragEnd() {
    draggingBvr.setDragSourceId("");
    draggingBvr.setDraggingOverId([undefined, false]);
  }

  function handleDrop(targetId) {
    onDrop(draggingBvr.dragSourceId, targetId, draggingBvr.isBefore);
    draggingBvr.setDraggingOverId([undefined, false]);
  }

  function handleDragOver(e, moveId) {
    e.preventDefault();
    const boundingRect = e.target.getBoundingClientRect();
    const height = boundingRect.bottom - boundingRect.top;
    const isBefore = e.clientY - boundingRect.top < 0.5 * height;
    draggingBvr.setDraggingOverId([moveId, isBefore]);
  }

  return {
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleDragEnd,
  };
}
