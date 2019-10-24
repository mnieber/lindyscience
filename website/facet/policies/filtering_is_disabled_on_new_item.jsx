// @flow

import { listen } from "facet/index";
import { Addition } from "facet/facets/addition";
import { Filtering } from "facet/facets/filtering";

export const filteringIsDisabledOnNewItem = (ctr: any) => {
  listen(Addition.get(ctr), "add", function() {
    Filtering.get(ctr).setEnabled(false);
  });
};
