// @flow

import { listen } from "facet/index";
import { Addition } from "facet/generic/addition";
import { Filtering } from "facet/generic/filtering";

export const filteringIsDisabledOnNewItem = (ctr: any) => {
  listen(Addition.get(ctr), "add", function() {
    Filtering.get(ctr).setEnabled(false);
  });
};
