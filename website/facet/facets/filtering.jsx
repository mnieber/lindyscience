// @flow

import {
  type ClassMemberT,
  type GetFacet,
  facetClass,
  input,
  output,
  extendInterface,
  listen,
  mapData,
  operation,
} from "facet/index";
import { action, observable } from "utils/mobx_wrapper";

// $FlowFixMe
@facetClass
export class Filtering {
  @observable isEnabled: boolean;
  @observable filter: any => boolean;

  @input inputItems: Array<any>;
  @output filteredItems: Array<any>;

  // $FlowFixMe
  @operation apply(filter: any => boolean) {}
  // $FlowFixMe
  @operation setEnabled(flag: boolean) {}

  static get: GetFacet<Filtering>;
}

const _handleFilteringSetEnabled = (self: Filtering) => {
  listen(
    self,
    "setEnabled",
    action("filteringSetEnabled", function(flag: boolean) {
      self.isEnabled = flag;
    })
  );
};

const _handleFilteringApply = (self: Filtering) => {
  listen(
    self,
    "apply",
    action("filteringApply", function(filter: any) {
      self.filter = filter;
      self.isEnabled = true;
    })
  );
};

const _handleFiltering = (self: Filtering) => {
  extendInterface(self, {
    get filteredItems() {
      const isEnabled = this.isEnabled;
      const filter = this.filter;
      return filter && isEnabled
        ? this.filter(this.inputItems)
        : this.inputItems;
    },
  });
};

export const initFiltering = (self: Filtering): Filtering => {
  _handleFilteringSetEnabled(self);
  _handleFilteringApply(self);
  _handleFiltering(self);
  return self;
};

export const filteringActsOnItems = ([Collection, items]: ClassMemberT) =>
  mapData([Collection, items], [Filtering, "inputItems"]);
