// @flow

import {
  type ClassMemberT,
  type GetFacet,
  facetClass,
  input,
  output,
  listen,
  mapDatas,
  operation,
} from "facet/index";
import { lookUp, range } from "utils/utils";
import { action, observable } from "utils/mobx_wrapper";

export type ItemSelectedPropsT = {
  itemId: any,
  isShift: boolean,
  isCtrl: boolean,
};

// $FlowFixMe
@facetClass
export class Selection {
  @input selectableIds: Array<any>;
  @observable ids: Array<any> = [];
  @observable anchorId: any;
  @output items: Array<any>;

  // $FlowFixMe
  @operation selectItem({ itemId, isShift, isCtrl }: ItemSelectedPropsT) {}

  static get: GetFacet<Selection>;
}

function _handleSelection(self: Selection) {
  listen(
    self,
    "selectItem",
    action("selectItem", ({ itemId, isShift, isCtrl }: ItemSelectedPropsT) => {
      const hasItem = self.ids.includes(itemId);

      if (isShift) {
        const startItemId = self.anchorId || itemId;
        const startIdx = self.selectableIds.indexOf(startItemId);
        const stopIdx = self.selectableIds.indexOf(itemId);
        const idxRange = range(
          Math.min(startIdx, stopIdx),
          1 + Math.max(startIdx, stopIdx)
        );
        self.ids = idxRange.map(idx => self.selectableIds[idx]);
      } else if (isCtrl) {
        self.ids = hasItem
          ? self.ids.filter(x => x !== itemId)
          : [...self.ids, itemId];
      } else {
        self.ids = [itemId];
      }

      // Move the anchor
      if (!(isCtrl && hasItem) && !(isShift && !!self.anchorId)) {
        self.anchorId = itemId;
      }
    })
  );
}

export function initSelection(self: Selection): Selection {
  _handleSelection(self);
  return self;
}

export const selectionActsOnItems = ([Collection, itemById]: ClassMemberT) =>
  mapDatas(
    [[Collection, itemById], [Selection, "ids"]],
    [Selection, "items"],
    (itemById, ids) => lookUp(ids, itemById)
  );
