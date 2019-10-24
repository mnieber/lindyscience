// @flow

import { type AdapterT, createPatch } from "screens/data_containers/utils";
import { Highlight } from "screens/data_containers/bvrs/highlight";

export const highlightActsOnItems = ({
  itemById: [Collection, itemById],
}: AdapterT) =>
  createPatch(Highlight, [Collection], collection => ({
    get item() {
      return collection[itemById][this.id];
    },
  }));
