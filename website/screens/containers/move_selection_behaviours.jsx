// @flow

import * as React from "react";

import { range } from "utils/utils";

import type { UUID, ObjectT } from "app/types";

// InsertItem Behaviour

export type SelectItemsBvrT<ItemT> = {|
  selectedItems: Array<ItemT>,
  select: (id: UUID, isShift: boolean, isCtrl: boolean) => void,
|};

export function useSelectItems<ItemT: ObjectT>(
  items: Array<ItemT>,
  anchorItemId: UUID,
  setAnchorItemId: UUID => void
): SelectItemsBvrT<ItemT> {
  const [selectedItems, setSelectedItems] = React.useState([]);

  function select(id: UUID, isShift: boolean, isCtrl: boolean) {
    const hasItem = selectedItems.find(x => x.id == id);
    const hasAnchor = !!anchorItemId;

    if (isShift) {
      const startId = anchorItemId || id;
      const startIdx = items.findIndex(x => x.id == startId);
      const stopIdx = items.findIndex(x => x.id == id);
      const idxRange = range(
        Math.min(startIdx, stopIdx),
        1 + Math.max(startIdx, stopIdx)
      );
      setSelectedItems(idxRange.map(idx => items[idx]));
    } else if (isCtrl) {
      setSelectedItems(
        hasItem
          ? selectedItems.filter(x => x.id != id)
          : [...selectedItems, ...items.filter(x => x.id == id)]
      );
    } else {
      setSelectedItems(items.filter(x => x.id == id));
    }

    // Move the anchor
    if (!(isCtrl && hasItem) && !(isShift && hasAnchor)) {
      setAnchorItemId(id);
    }
  }

  return { selectedItems, select };
}
