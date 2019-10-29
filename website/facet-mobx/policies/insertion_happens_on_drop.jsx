// @flow

import { listen } from "facet";
import { Dragging } from "facet-mobx/facets/dragging";
import { Insertion } from "facet-mobx/facets/insertion";

export const insertionHappensOnDrop = (ctr: any) => {
  listen(Dragging.get(ctr), "drop", function() {
    Insertion.get(ctr).insertPayload();
  });
};
