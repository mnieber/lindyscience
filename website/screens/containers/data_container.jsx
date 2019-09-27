// @flow

import * as React from "react";

import { getPreview, findTargetId } from "screens/utils";
import { insertIdsIntoList } from "utils/utils";
import { querySetListToDict } from "utils/utils";

import type { UUID, ObjectT } from "kernel/types";
type ItemById<ItemT> = { [UUID]: ItemT };

// DataContainer

export type DataContainerT<ItemT> = {|
  insert: (
    payload: Array<ItemT>,
    targetItemId: UUID,
    isBefore: boolean
  ) => void,
  preview: Array<ItemT>,
  payload: Array<ItemT>,
  targetItemId: UUID,
  setPayload: (payload: Array<ItemT>, targetId: UUID) => void,
|};

export function createDataContainerWithLocalState<ItemT: ObjectT>(
  initialItems: Array<ItemT>
): DataContainerT<ItemT> {
  const [itemById: ItemById<ItemT>, setItemById: Function] = React.useState(
    querySetListToDict(initialItems)
  );
  const [itemIds: Array<UUID>, setItemIds: Function] = React.useState(
    initialItems.map(x => x.id)
  );
  const [payload: Array<ItemT>, setPayload: Function] = React.useState([]);
  const [targetItemId: UUID, setTargetItemId: Function] = React.useState("");

  function _insert(
    payload: Array<ItemT>,
    targetItemId: UUID,
    isBefore: boolean
  ) {
    const predecessorId = findTargetId(itemIds, targetItemId, isBefore);
    setItemIds(insertIdsIntoList(payload, itemIds, predecessorId));
  }

  function _getItems() {
    return itemIds.map(x => itemById[x]);
  }

  const _setPayload = (payload: Array<ItemT>, targetItemId: UUID) => {
    setItemById({ ...itemById, ...querySetListToDict(payload) });
    setTargetItemId(targetItemId);
    setPayload(payload);
  };

  return {
    insert: _insert,
    preview: getPreview<ItemT>(_getItems(), payload, targetItemId),
    payload,
    targetItemId,
    setPayload: _setPayload,
  };
}
