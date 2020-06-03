// @flow

import { listen } from 'src/facet';
import { Dragging } from 'src/facet-mobx/facets/dragging';
import { Insertion } from 'src/facet-mobx/facets/insertion';

export const insertionHappensOnDrop = (ctr: any) => {
  listen(Dragging.get(ctr), 'drop', function () {
    Insertion.get(ctr).insertPayload();
  });
};
