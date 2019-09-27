// @flow

import * as React from "react";

import { getPreview } from "screens/utils";
import { insertIdsIntoList } from "utils/utils";
import { querySetListToDict } from "utils/utils";

import type { UUID, ObjectT } from "kernel/types";
type ItemById<ItemT> = { [UUID]: ItemT };

// DataContainer

export type DataContainerT<ItemT> = {|
  insertPayload: () => void,
  preview: Array<ItemT>,
  payload: Array<ItemT>,
  targetItemId: UUID,
  setPayload: (
    payload: Array<ItemT>,
    targetId: UUID,
    isBefore: boolean
  ) => void,
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
  const [payload: PayloadT, setPayload: Function] = React.useState([]);
  const [targetItemId: UUID, setTargetItemId: Function] = React.useState("");
  const [isBefore: UUID, setIsBefore: Function] = React.useState(false);

  function _insertPayload() {
    setItemIds(insertIdsIntoList(payload, itemIds, targetItemId, isBefore));
  }

  function _getItems() {
    return itemIds.map(x => itemById[x]);
  }

  const _setPayload = (
    payload: Array<ItemT>,
    targetItemId: UUID,
    isBefore: boolean
  ) => {
    setItemById({ ...itemById, ...querySetListToDict(payload) });
    setTargetItemId(targetItemId);
    setPayload(payload);
    setIsBefore(isBefore);
  };

  return {
    insertPayload: _insertPayload,
    preview: getPreview<ItemT>(_getItems(), payload, targetItemId, isBefore),
    payload,
    targetItemId,
    setPayload: _setPayload,
  };
}
