// @flow

import { type GetBvrT, facetClass, listen, operation, data } from "facet/index";
import { action, observable } from "utils/mobx_wrapper";

// $FlowFixMe
@facetClass
export class Addition {
  @observable item: any;
  @observable parentId: any;

  @data createItem: (values: any) => any;

  // $FlowFixMe
  @operation add(values: any) {}
  // $FlowFixMe
  @operation confirm() {}
  // $FlowFixMe
  @operation cancel() {}

  static get: GetBvrT<Addition>;
}

const _handleCancelNewItem = (self: Addition) => {
  listen(
    self,
    "cancel",
    action("cancelNewItem", function() {
      self.item = undefined;
      self.parentId = undefined;
    })
  );
};

const _handleAddNewItem = (self: Addition) => {
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
  }: {
    createItem: (values: any) => any,
  }
): Addition => {
  self.createItem = createItem;
  _handleCancelNewItem(self);
  _handleAddNewItem(self);
  return self;
};
