// @flow

import * as React from "react";

import { getPreview } from "screens/utils";
import { insertIdsIntoList } from "utils/utils";
import { querySetListToDict } from "utils/utils";

import type { UUID, ObjectT } from "kernel/types";
type ItemById<ItemT> = { [UUID]: ItemT };

// DataContainer

export type DataContainerT<ItemT> = {|
  insertPayload: boolean => void,
  preview: Array<ItemT>,
  payload: Array<ItemT>,
  targetItemId: UUID,
  setPayload: (
    payload: Array<ItemT>,
    targetId: UUID,
    isBefore: boolean
  ) => void,
|};

export type SimpleDataContainerT<ItemT> = {|
  insert: (payload: Array<ItemT>, targetId: UUID, isBefore: boolean) => void,
|};

export function createDataContainerWithLocalState<ItemT: ObjectT>(
  initialItems: Array<ItemT>
): DataContainerT<ItemT> {
  const [items: Array<ItemT>, setItems: Function] = React.useState([
    ...initialItems,
  ]);
  const [payload: Array<ItemT>, setPayload: Function] = React.useState([]);
  const [targetItemId: UUID, setTargetItemId: Function] = React.useState("");
  const [isBefore: UUID, setIsBefore: Function] = React.useState(false);

  function _setPayload(
    payload: Array<ItemT>,
    targetItemId: UUID,
    isBefore: boolean
  ) {
    setTargetItemId(targetItemId);
    setPayload(payload);
    setIsBefore(isBefore);
  }

  function _insertPayload(cancel: boolean) {
    if (!cancel) {
      const idx = items.map(x => x.id).indexOf(targetItemId);
      setItems([...items.slice(0, idx), ...payload, ...items.slice(idx)]);
    }
    _setPayload([], "", false);
  }

  return {
    insertPayload: _insertPayload,
    preview: getPreview<ItemT>(items, payload, targetItemId, isBefore),
    payload,
    targetItemId,
    setPayload: _setPayload,
  };
}
