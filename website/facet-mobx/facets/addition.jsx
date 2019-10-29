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

  @input createItem: (values: any) => any;
  @input isEqual: (lhs: any, rhs: any) => boolean;

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

const handleAddNewItem = (self: Addition) => {
  listen(
    self,
    "add",
    action("addNewItem", function(values: any) {
      self.item = self.createItem(values);
    })
  );
};

export const initAddition = (
  self: Addition,
  {
    createItem,
    isEqual,
  }: {
    createItem: (values: any) => any,
    isEqual: (lhs: any, rhs: any) => boolean,
  }
): Addition => {
  self.createItem = createItem;
  self.isEqual = isEqual;
  installHandlers([handleCancelNewItem, handleAddNewItem], self);
  return self;
};
