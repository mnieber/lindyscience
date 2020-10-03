import { input, installHandlers, operation, output } from 'src/npm/facet';
import { AdapterT, ClassMemberT } from 'src/npm/facet';
import { patchFacet, mapData, relayData } from 'src/npm/facet-mobx';
import { InsertPositionT, PayloadT } from 'src/npm/facet-mobx/facets/dragging';

export type InsertT = { payload: PayloadT; position: InsertPositionT };
export type PayloadSourceT = (container: any) => InsertT | undefined;

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
          if (!payload.find((x) => x.id === item.id)) {
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
  insertPosition?: InsertPositionT,
  payload?: PayloadT
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

type insertItemsT = (items: Array<any>) => any;

export class Insertion {
  @input payload?: PayloadT;
  @input position?: InsertPositionT;
  @input inputItems: Array<any>;
  @output preview: Array<any>;

  @operation insertPayload() {}

  static get = (ctr: any): Insertion => ctr.insertion;
}

const _handleInsertPayload = (insertItems: insertItemsT) => (
  self: Insertion
) => () => {
  if (self.position && self.payload) {
    const preview = getPreview(self.inputItems, self.position, self.payload);
    insertItems(preview);
  }
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
    insertItems: insertItemsT;
  }
) => {
  installHandlers({ insertPayload: _handleInsertPayload(insertItems) }, self);
  _handleInsert(self);
  return self;
};

export const insertionActsOnItems = ([Collection, items]: ClassMemberT) =>
  mapData([Collection, items], [Insertion, 'inputItems']);

export const insertionCreatesThePreview = ({
  preview: [Collection, previewMember],
}: AdapterT) => relayData([Insertion, 'preview'], [Collection, previewMember]);
