// @flow

// $FlowFixMe
import { observable } from "mobx";

import { type GetFacet, facetClass, operation, installHandlers } from "facet";

// $FlowFixMe
@facetClass
export class Addition {
  @observable item: any;
  @observable parentId: any;

  // $FlowFixMe
  @operation add(values: any) {}
  // $FlowFixMe
  @operation confirm(blah: any) {}
  // $FlowFixMe
  @operation cancel() {}

  static get: GetFacet<Addition>;
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
  installHandlers({
    add: handleAddNewItem(createItem),
    cancel: handleCancelNewItem,
  });
  return self;
};
