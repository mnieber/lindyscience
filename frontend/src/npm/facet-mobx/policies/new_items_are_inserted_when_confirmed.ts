// @flow

// $FlowFixMe
import { action } from 'mobx';

import { listen } from 'src/npm/facet';
import { Addition } from 'src/npm/facet-mobx/facets/addition';
import { Insertion } from 'src/npm/facet-mobx/facets/insertion';

export const newItemsAreInsertedWhenConfirmed = (ctr: any) => {
  listen(
    Addition.get(ctr),
    'confirm',
    action('insertItemWhenConfirmed', function () {
      Insertion.get(ctr).insertPayload();
      Addition.get(ctr).item = undefined;
      Addition.get(ctr).parentId = undefined;
    })
  );
};
