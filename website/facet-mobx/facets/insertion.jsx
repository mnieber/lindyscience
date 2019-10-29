// @flow

// $FlowFixMe
import { action } from "mobx";

import {
  type AdapterT,
  type ClassMemberT,
  type GetFacet,
  facetClass,
  input,
  output,
  listen,
  operation,
} from "facet";
import { patchFacet, mapData, relayData } from "facet-mobx";
import type { InsertPositionT, PayloadT } from "facet-mobx/facets/dragging";

export type InsertT = { payload: PayloadT, position: InsertPositionT };
export type PayloadSourceT = (container: any) => ?InsertT;

function _getPreview(
  items: Array<any>,
  targetItemId: any,
  isBefore: boolean,
  payload: Array<any>
): Array<any> {
  return !payload.length
    ? items
    : items.reduce(
        (acc, item) => {
          if (item.id == targetItemId && isBefore) {
            acc.push(...payload);
          }
          if (!payload.find(x => x.id === item.id)) {
            acc.push(item);
          }
          if (item.id == targetItemId && !isBefore) {
            acc.push(...payload);
          }
          return acc;
        },
        targetItemId ? [] : [...payload]
      );
}

export function getPreview(
  inputItems: Array<any>,
  insertPosition: ?InsertPositionT,
  payload: ?PayloadT
) {
  return inputItems && payload && insertPosition
    ? _getPreview(
        inputItems,
        insertPosition.targetItemId,
        insertPosition.isBefore,
        payload.data
      )
    : inputItems;
}

// $FlowFixMe
@facetClass
export class Insertion {
  @input payload: ?PayloadT;
  @input position: ?InsertPositionT;
  @input inputItems: Array<any>;
  @input insertItems: (items: Array<any>) => any;
  @output preview: Array<any>;

  // $FlowFixMe
  @operation insertPayload() {}

  static get: GetFacet<Insertion>;
}

const _handleInsertPayload = (self: Insertion) => {
  listen(
    self,
    "insertPayload",
    action("insertPayload", function() {
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

const _handleInsert = (self: Insertion) => {
  patchFacet(self, {
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

export const insertionCreatesThePreview = ({
  preview: [Collection, previewMember],
}: AdapterT) => relayData([Insertion, "preview"], [Collection, previewMember]);
