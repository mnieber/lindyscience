// @flow

import * as React from "react";

import { makeIdMatcher } from "screens/utils";

import type { DataContainerT } from "screens/containers/data_container";
import type { UUID, ObjectT } from "kernel/types";

// NewItem Behaviour

export type EditItemBvrT<ItemT> = {|
  newItem: ?ItemT,
  addNewItem: any => void,
  setHighlightedItemId: (itemId: UUID) => void,
  finalize: (isCancel: boolean, values: any) => void,
|};

export function useEditItem<ItemT: ObjectT>(
  highlightedItemId: UUID,
  setHighlightedItemId: (itemId: UUID) => void,
  dataContainer: DataContainerT<ItemT>,
  setIsEditing: boolean => void,
  createNewItem: any => ?ItemT,
  saveItem: (item: ItemT, values: any) => ItemT
): EditItemBvrT<ItemT> {
  const [newItem, setNewItem] = React.useState(null);

  // Store a new item in the function's state
  function addNewItem(props: any) {
    if (!newItem) {
      const newItem = createNewItem(props);
      if (newItem) {
        setNewItem(newItem);
        dataContainer.setPayload({
          payload: [newItem],
          targetItemId: highlightedItemId,
          isBefore: false,
        });
        setHighlightedItemId(newItem.id);
        setIsEditing(true);
      }
    }
  }

  function finalize(isCancel: boolean, values: any) {
    setIsEditing(false);
    if (isCancel) {
      if (dataContainer.payload) {
        setHighlightedItemId(dataContainer.payload.targetItemId);
      }
      dataContainer.setPayload(null);
    } else {
      const oldItem = dataContainer.preview.find(makeIdMatcher(values.id));
      if (oldItem) {
        saveItem(oldItem, values);
      }
      if (dataContainer.payload) {
        dataContainer.insertPayload(false);
      }
    }
    setNewItem(null);
  }

  function setHighlightedItemIdExt(itemId: UUID) {
    // Cancel the new item if the highlight items elsewhere
    if (newItem && itemId != newItem.id) {
      finalize(true, null);
    }
    setHighlightedItemId(itemId);
  }

  return {
    newItem,
    addNewItem,
    setHighlightedItemId: setHighlightedItemIdExt,
    finalize,
  };
}
