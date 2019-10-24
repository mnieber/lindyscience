// @flow

import {
  type GetBvrT,
  behaviour_impl,
  data,
  extendInterface,
  listen,
  operation,
} from "screens/data_containers/utils";
import type {
  InsertPositionT,
  PayloadT,
} from "screens/data_containers/bvrs/dragging";
import { action } from "utils/mobx_wrapper";
import { getPreview2 } from "screens/utils";

export type InsertT = { payload: PayloadT, position: InsertPositionT };
export type PayloadSourceT = (container: any) => ?InsertT;

export function getPreview(
  inputs: Array<any>,
  insertPosition: ?InsertPositionT,
  payload: ?PayloadT
) {
  return inputs && payload && insertPosition
    ? getPreview2(
        inputs,
        insertPosition.targetItemId,
        insertPosition.isBefore,
        payload.data
      )
    : inputs;
}

// $FlowFixMe
@behaviour_impl
export class Insertion {
  @data payload: ?PayloadT;
  @data position: ?InsertPositionT;
  @data inputs: Array<any>;
  @data preview: Array<any>;
  @data insertItems: (items: Array<any>) => any;

  // $FlowFixMe
  @operation insertPayload() {}

  static get: GetBvrT<Insertion>;
}

export type InsertionT = Insertion;

const _handleInsertPayload = (self: Insertion) => {
  listen(
    self,
    "insertPayload",
    action(function() {
      if (self.position && self.payload) {
        const preview = getPreview(self.inputs, self.position, self.payload);
        self.insertItems(preview);
      }
    })
  );
};

const _handleInsert = (self: InsertionT) => {
  extendInterface(self, {
    get preview() {
      const payload = this.payload;
      const position = this.position;

      return payload && payload.showPreview
        ? getPreview(this.inputs, position, payload)
        : this.inputs;
    },
  });
};

export const createInsertion = ({
  insertItems,
}: {
  insertItems: (items: Array<any>) => any,
}) => {
  const self = new Insertion();
  self.insertItems = insertItems;
  _handleInsertPayload(self);
  _handleInsert(self);
  return self;
};
