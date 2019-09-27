// @flow

import * as React from "react";

import type { EditMoveBvrT } from "screens/bvrs/move_crud_behaviours";
import type { DataContainerT } from "screens/containers/data_container";
import type { UUID } from "kernel/types";
import type { MoveT } from "moves/types";
import type { SelectItemsBvrT } from "screens/bvrs/move_selection_behaviours";

export type DraggingBvrT = {|
  draggingOverId: UUID,
  isBefore: boolean,
  setDraggingOverId: Function, // (Array<UUID | boolean>) => void
  finish: (drop: boolean) => void,
|};

export function useDragging(
  onDrop: (targetId: UUID, isBefore: boolean) => void
): DraggingBvrT {
  const [
    [draggingOverId: UUID, isBefore: boolean],
    setDraggingOverId,
  ] = React.useState(["", false]);

  const finish = (drop: boolean) => {
    if (drop) {
      onDrop(draggingOverId, isBefore);
    }
    setDraggingOverId(["", false]);
  };

  return {
    draggingOverId,
    isBefore,
    setDraggingOverId,
    finish,
  };
}

export const createDraggingBvr = (
  moveContainer: DataContainerT<MoveT>,
  selectMovesBvr: SelectItemsBvrT<MoveT>,
  editMoveBvr: EditMoveBvrT
): DraggingBvrT => {
  const selectedMoveIds = selectMovesBvr.selectedItems.map(x => x.id);
  const onDrop = (targetItemId: UUID, isBefore: boolean) => {
    const payload = moveContainer.preview.filter(move =>
      selectedMoveIds.includes(move.id)
    );

    if (
      !editMoveBvr.newItem ||
      !(payload.length === 1 && payload[0].id === editMoveBvr.newItem.id)
    ) {
      moveContainer.setPayload({ payload, targetItemId, isBefore });
      moveContainer.insertPayload(false);
    }
  };
  return useDragging(onDrop);
};
