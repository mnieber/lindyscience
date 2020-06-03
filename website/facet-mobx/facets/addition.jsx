// @flow

// $FlowFixMe
import { action, observable } from "mobx";

import {
  type GetFacet,
  facetClass,
  listen,
  operation,
  input,
  installHandlers,
} from "facet";

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

const handleCancelNewItem = (self: Addition) => {
  listen(
    self,
    "cancel",
    action("cancelNewItem", function() {
      self.item = undefined;
      self.parentId = undefined;
    })
  );
};

type CreateItemT = (values: any) => any;

const handleAddNewItem = (createItem: CreateItemT) => (self: Addition) => {
  listen(
    self,
    "add",
    action("addNewItem", function(values: any) {
      self.item = createItem(values);
    })
  );
};

export const initAddition = (
  self: Addition,
  {
    createItem,
  }: {
    createItem: CreateItemT,
  }
): Addition => {
  installHandlers([handleCancelNewItem, handleAddNewItem(createItem)], self);
  return self;
};
