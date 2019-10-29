// @flow

import { listen } from "facet";
import { Addition } from "facet-mobx/facets/addition";
import { Filtering } from "facet-mobx/facets/filtering";

export const filteringIsDisabledOnNewItem = (ctr: any) => {
  listen(Addition.get(ctr), "add", function() {
    Filtering.get(ctr).setEnabled(false);
  });
};
