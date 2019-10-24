// @flow

import { Selection } from "screens/data_containers/bvrs/selection";
import { type AdapterT, createPatch } from "screens/data_containers/utils";
import { lookUp } from "utils/utils";

export const selectionActsOnItems = ({
  itemById: [Collection, itemById],
}: AdapterT) =>
  createPatch(Selection, [Collection], collection => {
    return {
      get items() {
        return lookUp(this.ids, collection[itemById]);
      },
    };
  });
