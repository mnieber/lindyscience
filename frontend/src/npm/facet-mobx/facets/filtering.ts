// @flow

// $FlowFixMe
import { observable } from 'mobx';

import { input, installHandlers, operation, output } from 'src/npm/facet';
import { ClassMemberT } from 'src/npm/facet';
import { patchFacet, mapData } from 'src/npm/facet-mobx';

export class Filtering {
  @observable isEnabled: boolean;
  @observable filter: (any) => Array<any>;

  @input inputItems: Array<any>;
  @output filteredItems: Array<any>;

  @operation apply(filter: (any) => Array<any>) {}
  @operation setEnabled(flag: boolean) {}

  static get = (ctr: any): Filtering => ctr.filtering;
}

const _handleFilteringSetEnabled = (self: Filtering) => (flag: boolean) => {
  self.isEnabled = flag;
};

const _handleFilteringApply = (self: Filtering) => (filter: any) => {
  self.filter = filter;
  self.isEnabled = true;
};

const _handleFiltering = (self: Filtering) => {
  patchFacet(self, {
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
  installHandlers(
    {
      apply: _handleFilteringApply,
      setEnabled: _handleFilteringSetEnabled,
    },
    self
  );

  _handleFiltering(self);
  return self;
};

export const filteringActsOnItems = ([Collection, items]: ClassMemberT) =>
  mapData([Collection, items], [Filtering, 'inputItems']);
