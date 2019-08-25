// @flow

import * as React from "react";

import type { UUID } from "kernel/types";
import type { MoveT } from "moves/types";
import type { SelectItemsBvrT } from "screens/bvrs/move_selection_behaviours";
import type {
  InsertItemsBvrT,
  NewItemBvrT,
} from "screens/bvrs/crud_behaviours";

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
  moves: Array<MoveT>,
  selectMovesBvr: SelectItemsBvrT<MoveT>,
  newMoveBvr: NewItemBvrT<MoveT>,
  insertMovesBvr: InsertItemsBvrT<MoveT>
): DraggingBvrT => {
  const selectedMoveIds = selectMovesBvr.selectedItems.map(x => x.id);
  const onDrop = (targetId: UUID, isBefore: boolean) => {
    const payloadIds = moves
      .map(x => x.id)
      .filter(x => selectedMoveIds.includes(x));

    if (
      !newMoveBvr.newItem ||
      !(payloadIds.length === 1 && payloadIds[0] === newMoveBvr.newItem.id)
    ) {
      insertMovesBvr.insertDirectly(payloadIds, targetId, isBefore);
    }
  };
  return useDragging(onDrop);
};
