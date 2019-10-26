// @flow

import {
  type GetBvrT,
  behaviour_impl,
  listen,
  operation,
  data,
} from "facets/index";
import { action, observable } from "utils/mobx_wrapper";

// $FlowFixMe
@behaviour_impl
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
    action(function() {
      self.item = undefined;
      self.parentId = undefined;
    })
  );
};

const _handleAddNewItem = (self: Addition) => {
  listen(
    self,
    "add",
    action(function(values: any) {
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
