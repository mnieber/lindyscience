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

  // $FlowFixMe
  @operation apply(filter: any => boolean) {}
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
    action(function(filter: any) {
      self.filter = filter;
      self.isEnabled = true;
    })
  );
};

export const createFiltering = (): Filtering => {
  const self = new Filtering();
  _handleFilteringSetEnabled(self);
  _handleFilteringApply(self);
  return self;
};
