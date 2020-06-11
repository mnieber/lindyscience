// @flow

// $FlowFixMe
import { observable } from 'mobx';

import { operation, installHandlers } from 'src/npm/facet';

export class Addition {
  @observable item: any;
  @observable parentId: any;

  @operation add(values: any) {}
  @operation confirm(data: any) {}
  @operation cancel() {}

  static get = (ctr: any): Addition => ctr.addition;
}

const handleCancelNewItem = (self: Addition) => () => {
  self.item = undefined;
  self.parentId = undefined;
};

type CreateItemT = (values: any) => any;

const handleAddNewItem = (createItem: CreateItemT) => (self: Addition) => (
  values: any
) => {
  self.item = createItem(values);
};

export const initAddition = (
  self: Addition,
  {
    createItem,
  }: {
    createItem: CreateItemT,
  }
): Addition => {
  installHandlers(
    {
      add: handleAddNewItem(createItem),
      cancel: handleCancelNewItem,
    },
    self
  );
  return self;
};
