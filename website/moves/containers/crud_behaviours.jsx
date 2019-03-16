// @flow

import * as React from "react";
import type { UUID, ObjectT } from "app/types";

// InsertItem Behaviour

export type InsertItemsBvrT<ItemT> = {|
  preview: Array<ItemT>,
  previewItems: Array<ItemT>,
  prepare: (targetItemId: UUID, items: Array<ItemT>) => void,
  finalize: (isCancel: boolean) => UUID,
  insertDirectly: (
    itemIds: Array<UUID>,
    targetItemId: UUID,
    isBefore: boolean
  ) => void,
|};

export function useInsertItems<ItemT: ObjectT>(
  items: Array<ItemT>,
  insertItemIds: (itemIds: Array<UUID>, targetItemId: UUID) => void
): InsertItemsBvrT<ItemT> {
  const [targetItemId, setTargetItemId] = React.useState("");
  const [previewItems, setPreviewItems] = React.useState([]);

  const preview = !previewItems.length
    ? items
    : items.reduce(
        (acc, item) => {
          if (!previewItems.includes(item.id)) {
            acc.push(item);
          }
          if (item.id == targetItemId) {
            acc.push(...previewItems);
          }
          return acc;
        },
        targetItemId ? [] : [...previewItems]
      );

  function insertDirectly(
    itemIds: Array<UUID>,
    targetItemId: UUID,
    isBefore: boolean
  ) {
    if (isBefore) {
      const idx = items.findIndex(x => x.id == targetItemId) - 1;
      targetItemId = idx < 0 ? "" : items[idx].id;
    }
    insertItemIds(itemIds, targetItemId);
  }

  function prepare(targetItemId: UUID, items: Array<ItemT>) {
    if (items.length) {
      setPreviewItems(items);
      setTargetItemId(targetItemId);
    }
  }

  function finalize(isCancel: boolean) {
    const result = targetItemId;
    if (previewItems.length && !isCancel) {
      insertDirectly(previewItems.map(x => x.id), targetItemId, false);
    }
    setPreviewItems([]);
    setTargetItemId("");
    return result;
  }

  return { preview, previewItems, prepare, finalize, insertDirectly };
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
        insertItemsBvr.prepare(highlightedItemId, [newItem]);
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
