// @flow

import * as React from 'react'
import type { UUID, ObjectT } from 'app/types';


// InsertItem Behaviour

export type InsertItemBvrT<ItemT> = {|
  preview: Array<ItemT>,
  previewItem: ?ItemT,
  prepare: Function,
  finalize: Function,
  insertDirectly: Function
|};

export function useInsertItem<ItemT: ObjectT>(
  items: Array<ItemT>,
  insertItem: Function,
): InsertItemBvrT<ItemT> {
  const [targetItemId, setTargetItemId] = React.useState("");
  const [previewItem, setPreviewItem] = React.useState(null);

  const preview = !previewItem
    ? items
    : items.reduce(
      (acc, item) => {
        if (item.id != previewItem.id) {
          acc.push(item);
        }
        if (item.id == targetItemId) {
          acc.push(previewItem);
        }
        return acc;
      },
      targetItemId ? [] : [previewItem]
    );

  function insertDirectly(
    previewItemId: UUID, targetItemId: UUID, isBefore: boolean
  ) {
    if (isBefore) {
      const idx = items.findIndex(x => x.id == targetItemId) - 1;
      targetItemId = idx < 0 ? "" : items[idx].id;
    }
    insertItem(previewItemId, targetItemId);
  }

  function prepare(targetItemId: UUID, item: ItemT) {
    if (item) {
      setPreviewItem(item);
      setTargetItemId(targetItemId);
    }
  }

  function finalize(isCancel: boolean) {
    const result = targetItemId;
    if (previewItem && !isCancel) {
      insertDirectly(previewItem.id, targetItemId, false)
    }
    setPreviewItem(null);
    setTargetItemId("");
    return result;
  }

  return {preview, previewItem, prepare, finalize, insertDirectly};
}


// NewItem Behaviour

export type NewItemBvrT<ItemT> = {|
  newItem: ?ItemT,
  addNewItem: Function,
  finalize: Function,
  setHighlightedItemId: Function,
|};

export function useNewItem<ItemT>(
  highlightedItemId: UUID,
  setHighlightedItemId: Function,
  insertItemBvr: InsertItemBvrT<ItemT>,
  setIsEditing: Function,
  createNewItem: Function,
): NewItemBvrT<ItemT> {
  const [newItem, setNewItem] = React.useState(null);

  // Store a new item in the function's state
  function addNewItem() {
    if (!newItem) {
      const newItem = createNewItem();
      if (newItem) {
        setNewItem(newItem);
        insertItemBvr.prepare(highlightedItemId, newItem);
        setHighlightedItemId(newItem.id);
        setIsEditing(true);
      }
    }
  }

  // Remove new item from the function's state
  function finalize(isCancel: boolean) {
    setIsEditing(false);
    const targetItemId = insertItemBvr.finalize(isCancel);
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
    setHighlightedItemId: setHighlightedItemIdExt
  };
}


// SaveItem Behaviour

export type SaveItemBvrT<ItemT> = {
  saveItem: Function,
  discardChanges: Function,
};

export function useSaveItem<ItemT: ObjectT>(
  newItemBvr: NewItemBvrT<ItemT>,
  setIsEditing: Function,
  saveItem: Function,
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

  return {saveItem: saveItemExt, discardChanges};
}
