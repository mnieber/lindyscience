import { listen } from 'src/npm/facet';
import { Addition } from 'src/npm/facet-mobx/facets/addition';
import { Filtering } from 'src/npm/facet-mobx/facets/filtering';

export const filteringIsDisabledOnNewItem = (ctr: any) => {
  listen(Addition.get(ctr), 'add', function () {
    Filtering.get(ctr).setEnabled(false);
  });
};
