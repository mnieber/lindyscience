// @flow

import { Filtering } from "screens/data_containers/bvrs/filtering";
import { type AdapterT, createPatch } from "screens/data_containers/utils";

export const filteringActsOnItems = ({
  items: [Collection, items],
}: AdapterT) =>
  createPatch(Filtering, [Collection], (collection: Collection) => ({
    get inputItems() {
      return collection[items];
    },
    get filteredItems() {
      const isEnabled = this.isEnabled;
      const filter = this.filter;
      return filter && isEnabled
        ? this.filter(this.inputItems)
        : this.inputItems;
    },
  }));
