// @flow

import {
  type GetBvrT,
  behaviour_impl,
  listen,
  operation,
} from "screens/data_containers/utils";
import { action, observable } from "utils/mobx_wrapper";

// $FlowFixMe
@behaviour_impl
export class Editing {
  @observable isEditing: boolean;
  saveItem: (values: any) => any;

  // $FlowFixMe
  @operation save(values: any) {}
  // $FlowFixMe
  @operation cancel() {}
  // $FlowFixMe
  @operation setIsEditing(flag: boolean) {}

  static get: GetBvrT<Editing>;
}

export type EditingT = Editing;

const _handleEditingCancel = (self: Editing) => {
  listen(
    self,
    "cancel",
    action(function() {
      self.isEditing = false;
    })
  );
};

const _handleEditingSave = (self: Editing) => {
  listen(
    self,
    "save",
    action(function(values: any) {
      self.isEditing = false;
      self.saveItem(values);
    })
  );
};

const _handleEditingSetIsEditing = (self: Editing) => {
  listen(
    self,
    "setIsEditing",
    action(function(flag: boolean) {
      self.isEditing = flag;
    })
  );
};

export const createEditing = ({
  saveItem,
}: {
  saveItem: (values: any) => any,
}): Editing => {
  const self = new Editing();
  self.saveItem = saveItem;
  _handleEditingCancel(self);
  _handleEditingSave(self);
  _handleEditingSetIsEditing(self);
  return self;
};
