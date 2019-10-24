// @flow

import { listen } from "screens/data_containers/utils";
import { Addition } from "screens/data_containers/bvrs/addition";
import { Filtering } from "screens/data_containers/bvrs/filtering";

export const filteringIsDisabledOnNewItem = (ctr: any) => {
  listen(Addition.get(ctr), "add", function() {
    Filtering.get(ctr).setEnabled(false);
  });
};
