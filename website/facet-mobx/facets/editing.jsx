// @flow

// $FlowFixMe
import { action, observable } from "mobx";

import { type GetFacet, facetClass, listen, operation, input } from "facet";

// $FlowFixMe
@facetClass
export class Editing {
  @observable isEditing: boolean;

  @input saveItem: (values: any) => any;

  // $FlowFixMe
  @operation save(values: any) {}
  // $FlowFixMe
  @operation cancel() {}
  // $FlowFixMe
  @operation setIsEditing(flag: boolean) {}

  static get: GetFacet<Editing>;
}

const _handleEditingCancel = (self: Editing) => {
  listen(
    self,
    "cancel",
    action("editingCancel", function() {
      self.isEditing = false;
    })
  );
};

const _handleEditingSave = (self: Editing) => {
  listen(
    self,
    "save",
    action("editingSave", function(values: any) {
      self.isEditing = false;
      self.saveItem(values);
    })
  );
};

const _handleEditingSetIsEditing = (self: Editing) => {
  listen(
    self,
    "setIsEditing",
    action("setIsEditing", function(flag: boolean) {
      self.isEditing = flag;
    })
  );
};

export const initEditing = (
  self: Editing,
  {
    saveItem,
  }: {
    saveItem: (values: any) => any,
  }
): Editing => {
  self.saveItem = saveItem;
  _handleEditingCancel(self);
  _handleEditingSave(self);
  _handleEditingSetIsEditing(self);
  return self;
};