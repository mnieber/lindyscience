// @flow

import * as React from "react";

import { getPreview } from "screens/utils";
import { insertIdsIntoList } from "utils/utils";
import { querySetListToDict } from "utils/utils";

import type { UUID, ObjectT } from "kernel/types";
type ItemById<ItemT> = { [UUID]: ItemT };

export type PayloadT<ItemT> = {
  payload: Array<ItemT>,
  targetItemId: UUID,
  isBefore: boolean,
};

// DataContainer

export type DataContainerT<ItemT> = {|
  insertPayload: boolean => void,
  preview: Array<ItemT>,
  payload: ?PayloadT<ItemT>,
  setPayload: (?PayloadT<ItemT>) => void,
|};

export function createDataContainerWithLocalState<ItemT: ObjectT>(
  initialItems: Array<ItemT>
): DataContainerT<ItemT> {
  const [items: Array<ItemT>, setItems: Function] = React.useState([
    ...initialItems,
  ]);
  const [payload: ?PayloadT<ItemT>, setPayload: Function] = React.useState(
    null
  );

  function _insertPayload(cancel: boolean) {
    if (!cancel && payload != null) {
      const idx = items.map(x => x.id).indexOf(payload.targetItemId);
      setItems([
        ...items.slice(0, idx),
        ...payload.payload,
        ...items.slice(idx),
      ]);
    }
    setPayload(null);
  }

  return {
    insertPayload: _insertPayload,
    preview: getPreview<ItemT>(items, payload),
    payload,
    setPayload,
  };
}
