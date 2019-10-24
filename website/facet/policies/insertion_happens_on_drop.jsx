// @flow

import { listen } from "facet/index";
import { Dragging } from "facet/facets/dragging";
import { Insertion } from "facet/facets/insertion";

export const insertionHappensOnDrop = (ctr: any) => {
  listen(Dragging.get(ctr), "drop", function() {
    Insertion.get(ctr).insertPayload();
  });
};
