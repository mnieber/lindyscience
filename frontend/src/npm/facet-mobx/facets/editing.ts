import { observable } from 'mobx';

import { installHandlers, operation } from 'src/npm/facet';

type saveItemT = (values: any) => any;

export class Editing {
  @observable isEditing?: boolean;

  @operation save(values: any) {}
  @operation cancel() {}
  @operation setIsEditing(flag: boolean) {}

  static get = (ctr: any): Editing => ctr.editing;
}

const _handleEditingCancel = (self: Editing) => () => {
  self.isEditing = false;
};

const _handleEditingSave = (saveItem: saveItemT) => (self: Editing) => (
  values: any
) => {
  self.isEditing = false;
  saveItem(values);
};

const _handleEditingSetIsEditing = (self: Editing) => (flag: boolean) => {
  self.isEditing = flag;
};

export const initEditing = (
  self: Editing,
  {
    saveItem,
  }: {
    saveItem: saveItemT;
  }
): Editing => {
  installHandlers(
    {
      cancel: _handleEditingCancel,
      save: _handleEditingSave(saveItem),
      setIsEditing: _handleEditingSetIsEditing,
    },
    self
  );
  return self;
};
