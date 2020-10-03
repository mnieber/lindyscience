import { listen } from 'src/npm/facet';
import { Dragging } from 'src/npm/facet-mobx/facets/dragging';
import { Insertion } from 'src/npm/facet-mobx/facets/insertion';

export const insertionHappensOnDrop = (ctr: any) => {
  listen(Dragging.get(ctr), 'drop', function () {
    Insertion.get(ctr).insertPayload();
  });
};
