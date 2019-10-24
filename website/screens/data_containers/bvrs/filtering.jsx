// @flow

import {
  type GetBvrT,
  behaviour_impl,
  data,
  listen,
  operation,
} from "screens/data_containers/utils";
import { action, observable } from "utils/mobx_wrapper";

// $FlowFixMe
@behaviour_impl
export class Filtering {
  @observable isEnabled: boolean;
  @observable filter: any => boolean;
  @data inputItems: Array<any>;
  @data filteredItems: Array<any>;
  createFilter: (filterOptions: any) => any;

  // $FlowFixMe
  @operation apply(filterOptions: any) {}
  // $FlowFixMe
  @operation setEnabled(flag: boolean) {}

  static get: GetBvrT<Filtering>;
}

export type FilteringT = Filtering;

const _handleFilteringSetEnabled = (self: Filtering) => {
  listen(
    self,
    "setEnabled",
    action(function(flag: boolean) {
      self.isEnabled = flag;
    })
  );
};

const _handleFilteringApply = (self: Filtering) => {
  listen(
    self,
    "apply",
    action(function(filterOptions: any) {
      self.filter = self.createFilter(filterOptions);
      self.isEnabled = true;
    })
  );
};

export const createFiltering = ({
  createFilter,
}: {
  createFilter: (filterOptions: any) => any,
}): Filtering => {
  const self = new Filtering();
  self.createFilter = createFilter;
  _handleFilteringSetEnabled(self);
  _handleFilteringApply(self);
  return self;
};
