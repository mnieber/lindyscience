// @flow

import { listen } from "screens/data_containers/utils";
import { Dragging } from "screens/data_containers/bvrs/dragging";
import { Insertion } from "screens/data_containers/bvrs/insertion";

export const insertionHappensOnDrop = (ctr: any) => {
  listen(Dragging.get(ctr), "drop", function() {
    Insertion.get(ctr).insertPayload();
  });
};
