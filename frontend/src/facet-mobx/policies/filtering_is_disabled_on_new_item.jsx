// @flow

import { listen } from 'src/facet';
import { Addition } from 'src/facet-mobx/facets/addition';
import { Filtering } from 'src/facet-mobx/facets/filtering';

export const filteringIsDisabledOnNewItem = (ctr: any) => {
  listen(Addition.get(ctr), 'add', function () {
    Filtering.get(ctr).setEnabled(false);
  });
};
