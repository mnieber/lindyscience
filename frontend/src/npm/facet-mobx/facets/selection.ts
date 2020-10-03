import { observable } from 'mobx';

import { data, input, installHandlers, operation, output } from 'src/npm/facet';
import { lookUp, range } from 'src/npm/facet-mobx/internal/utils';
import { mapDatas } from 'src/npm/facet-mobx';

export type ItemSelectedPropsT = {
  itemId: any;
  isShift: boolean;
  isCtrl: boolean;
};

export class Selection {
  @input selectableIds?: Array<any>;
  @data @observable ids: Array<any> = [];
  @data @observable anchorId: any;
  @output items?: Array<any>;

  @operation selectItem({ itemId, isShift, isCtrl }: ItemSelectedPropsT) {}

  static get = (ctr: any): Selection => ctr.selection;
}

const _handleSelectItem = (self: Selection) => ({
  itemId,
  isShift,
  isCtrl,
}: ItemSelectedPropsT) => {
  const hasItem = self.ids.includes(itemId);
  const selectableIds = self.selectableIds;

  if (!selectableIds) {
    throw Error('logical error');
  }

  if (isShift) {
    const startItemId = self.anchorId || itemId;
    const startIdx = selectableIds.indexOf(startItemId);
    const stopIdx = selectableIds.indexOf(itemId);
    const idxRange = range(
      Math.min(startIdx, stopIdx),
      1 + Math.max(startIdx, stopIdx)
    );
    self.ids = idxRange.map((idx) => selectableIds[idx]);
  } else if (isCtrl) {
    self.ids = hasItem
      ? self.ids.filter((x) => x !== itemId)
      : [...self.ids, itemId];
  } else {
    self.ids = [itemId];
  }

  // Move the anchor
  if (!(isCtrl && hasItem) && !(isShift && !!self.anchorId)) {
    self.anchorId = itemId;
  }
};

export function initSelection(self: Selection): Selection {
  installHandlers({ selectItem: _handleSelectItem }, self);
  return self;
}

export const selectionActsOnItems = ([Collection, itemById]: any) =>
  mapDatas(
    [
      [Collection, itemById],
      [Selection, 'ids'],
    ],
    [Selection, 'items'],
    (itemById: any, ids: any) => lookUp(ids, itemById)
  );
