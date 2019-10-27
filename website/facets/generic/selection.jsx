// @flow

import {
  type ClassMemberT,
  type GetBvrT,
  behaviour_impl,
  data,
  listen,
  mapDatas,
  operation,
} from "facets/index";
import { lookUp, range } from "utils/utils";
import { action, observable } from "utils/mobx_wrapper";

export type ItemSelectedPropsT = {
  itemId: any,
  isShift: boolean,
  isCtrl: boolean,
};

// $FlowFixMe
@behaviour_impl
export class Selection {
  @data selectableIds: Array<any>;
  @observable ids: Array<any> = [];
  @observable anchorId: any;
  @data items: Array<any>;

  // $FlowFixMe
  @operation selectItem({ itemId, isShift, isCtrl }: ItemSelectedPropsT) {}

  static get: GetBvrT<Selection>;
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
