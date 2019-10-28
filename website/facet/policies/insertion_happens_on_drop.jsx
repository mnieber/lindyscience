// @flow

import { listen } from "facet/index";
import { Dragging } from "facet/generic/dragging";
import { Insertion } from "facet/generic/insertion";

export const insertionHappensOnDrop = (ctr: any) => {
  listen(Dragging.get(ctr), "drop", function() {
    Insertion.get(ctr).insertPayload();
  });
};
