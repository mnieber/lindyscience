// @flow

import * as React from "react";

import type { UUID } from "kernel/types";

export type DraggingBvrT = {|
  draggingOverId: UUID,
  isBefore: boolean,
  setDraggingOverId: Function, // (Array<UUID | boolean>) => void
|};

export function useDragging(): DraggingBvrT {
  const [
    [draggingOverId: UUID, isBefore: boolean],
    setDraggingOverId,
  ] = React.useState(["", false]);

  return {
    draggingOverId,
    isBefore,
    setDraggingOverId,
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
  onDrop: (sourceIds: Array<UUID>, targetId: UUID, isBefore: boolean) => void
): DragHandlersT {
  function handleDragStart(sourceId) {}

  function handleDragEnd() {
    draggingBvr.setDraggingOverId([undefined, false]);
  }

  function handleDrop(payloadIds, targetId) {
    onDrop(payloadIds, targetId, draggingBvr.isBefore);
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
