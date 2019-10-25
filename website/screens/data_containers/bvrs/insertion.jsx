// @flow

import {
  type ClassMemberT,
  type GetBvrT,
  behaviour_impl,
  data,
  extendInterface,
  listen,
  mapData,
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
  inputItems: Array<any>,
  insertPosition: ?InsertPositionT,
  payload: ?PayloadT
) {
  return inputItems && payload && insertPosition
    ? getPreview2(
        inputItems,
        insertPosition.targetItemId,
        insertPosition.isBefore,
        payload.data
      )
    : inputItems;
}

// $FlowFixMe
@behaviour_impl
export class Insertion {
  @data payload: ?PayloadT;
  @data position: ?InsertPositionT;
  @data inputItems: Array<any>;
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
        const preview = getPreview(
          self.inputItems,
          self.position,
          self.payload
        );
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
        ? getPreview(this.inputItems, position, payload)
        : this.inputItems;
    },
  });
};

export const initInsertion = (
  self: Insertion,
  {
    insertItems,
  }: {
    insertItems: (items: Array<any>) => any,
  }
) => {
  self.insertItems = insertItems;
  _handleInsertPayload(self);
  _handleInsert(self);
  return self;
};

export const insertionActsOnItems = ([Collection, items]: ClassMemberT) =>
  mapData([Collection, items], [Insertion, "inputItems"]);
