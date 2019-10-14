// @flow

import { Insertion, getPreview } from "screens/data_containers/bvrs/insertion";
import {
  type AdapterT,
  behaviourClassName,
  createPatch,
} from "screens/data_containers/utils";

export const insertionActsOnItems = ({
  items: [Collection, items],
}: AdapterT) =>
  createPatch(Insertion, [Collection], collection => ({
    get inputs() {
      if (!collection[items]) {
        console.error(
          `No property ${items} in ${behaviourClassName(Collection)}`
        );
      }
      return collection[items];
    },
    get preview() {
      const payload = this.payload;
      const position = this.position;

      return payload && payload.showPreview
        ? getPreview(this.inputs, position, payload)
        : this.inputs;
    },
  }));
