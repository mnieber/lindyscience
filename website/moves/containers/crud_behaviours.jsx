// @flow

import * as React from "react";

import { getPreview } from "moves/utils";

import type { UUID, ObjectT } from "app/types";
import type { DataContainerT } from "moves/containers/data_container";

// InsertItem Behaviour

export type InsertItemsBvrT<ItemT> = {|
  prepare: (items: Array<ItemT>, targetItemId: UUID) => void,
  finalize: (isCancel: boolean) => UUID,
  insertDirectly: (
    payloadIds: Array<UUID>,
    targetItemId: UUID,
    isBefore: boolean
  ) => void,
  preview: Array<ItemT>,
|};

export function useInsertItems<ItemT: ObjectT>(
  dataContainer: DataContainerT<ItemT>
): InsertItemsBvrT<ItemT> {
  function finalize(isCancel: boolean) {
    const result = dataContainer.targetItemId;
    if (dataContainer.payloadIds.length && !isCancel) {
      dataContainer.insert(
        dataContainer.payloadIds,
        dataContainer.targetItemId,
        false
      );
    }
    dataContainer.setPayload([], "");
    return result;
  }

  return {
    prepare: dataContainer.setPayload,
    finalize,
    insertDirectly: dataContainer.insert,
    preview: dataContainer.preview,
  };
}

// NewItem Behaviour

export type NewItemBvrT<ItemT> = {|
  newItem: ?ItemT,
  addNewItem: () => void,
  finalize: (isCancel: boolean) => void,
  setHighlightedItemId: (itemId: UUID) => void,
|};

export function useNewItem<ItemT: ObjectT>(
  highlightedItemId: UUID,
  setHighlightedItemId: (itemId: UUID) => void,
  insertItemsBvr: InsertItemsBvrT<ItemT>,
  setIsEditing: boolean => void,
  createNewItem: () => ?ItemT
): NewItemBvrT<ItemT> {
  const [newItem, setNewItem] = React.useState(null);

  // Store a new item in the function's state
  function addNewItem() {
    if (!newItem) {
      const newItem = createNewItem();
      if (newItem) {
        setNewItem(newItem);
        insertItemsBvr.prepare([newItem], highlightedItemId);
        setHighlightedItemId(newItem.id);
        setIsEditing(true);
      }
    }
  }

  // Remove new item from the function's state
  function finalize(isCancel: boolean) {
    setIsEditing(false);
    const targetItemId = insertItemsBvr.finalize(isCancel);
    if (newItem && isCancel) {
      setHighlightedItemId(targetItemId);
    }
    setNewItem(null);
  }

  function setHighlightedItemIdExt(itemId: UUID) {
    // Cancel the new item if the highlight items elsewhere
    if (newItem && itemId != newItem.id) {
      finalize(true);
    }
    setHighlightedItemId(itemId);
  }

  return {
    newItem,
    addNewItem,
    finalize,
    setHighlightedItemId: setHighlightedItemIdExt,
  };
}

// SaveItem Behaviour

export type SaveItemBvrT<ItemT> = {
  saveItem: (id: UUID, incompleteValues: any) => void,
  discardChanges: () => void,
};

export function useSaveItem<ItemT: ObjectT>(
  newItemBvr: NewItemBvrT<ItemT>,
  setIsEditing: boolean => void,
  saveItem: (id: UUID, incompleteValues: any) => void
): SaveItemBvrT<ItemT> {
  function saveItemExt(id: UUID, incompleteValues: any) {
    saveItem(id, incompleteValues);
    newItemBvr.finalize(false);
    setIsEditing(false);
  }

  function discardChanges() {
    newItemBvr.finalize(true);
    setIsEditing(false);
  }

  return { saveItem: saveItemExt, discardChanges };
}
