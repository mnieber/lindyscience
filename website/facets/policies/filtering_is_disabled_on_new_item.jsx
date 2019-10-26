// @flow

import { listen } from "facets/index";
import { Addition } from "facets/generic/addition";
import { Filtering } from "facets/generic/filtering";

export const filteringIsDisabledOnNewItem = (ctr: any) => {
  listen(Addition.get(ctr), "add", function() {
    Filtering.get(ctr).setEnabled(false);
  });
};
