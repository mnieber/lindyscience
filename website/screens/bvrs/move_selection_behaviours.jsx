// @flow

import * as React from "react";

import { makeIdMatcher } from "screens/utils";
import { range } from "utils/utils";

import type { UUID, ObjectT } from "kernel/types";

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
    const hasItem = selectedItems.find(makeIdMatcher(id));
    const hasAnchor = !!anchorItemId;

    if (isShift) {
      const startId = anchorItemId || id;
      const startIdx = items.findIndex(makeIdMatcher(startId));
      const stopIdx = items.findIndex(makeIdMatcher(id));
      const idxRange = range(
        Math.min(startIdx, stopIdx),
        1 + Math.max(startIdx, stopIdx)
      );
      setSelectedItems(idxRange.map(idx => items[idx]));
    } else if (isCtrl) {
      setSelectedItems(
        hasItem
          ? selectedItems.filter(makeIdMatcher(id))
          : [...selectedItems, ...items.filter(makeIdMatcher(id))]
      );
    } else {
      setSelectedItems(items.filter(makeIdMatcher(id)));
    }

    // Move the anchor
    if (!(isCtrl && hasItem) && !(isShift && hasAnchor)) {
      setAnchorItemId(id);
    }
  }

  return { selectedItems, select };
}
