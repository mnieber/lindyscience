// @flow

import { listen } from "facets/index";
import { Dragging } from "facets/generic/dragging";
import { Insertion } from "facets/generic/insertion";

export const insertionHappensOnDrop = (ctr: any) => {
  listen(Dragging.get(ctr), "drop", function() {
    Insertion.get(ctr).insertPayload();
  });
};
