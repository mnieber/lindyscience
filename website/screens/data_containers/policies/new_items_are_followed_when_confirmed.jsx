// @flow

import { Labelling } from "screens/data_containers/bvrs/labelling";
import { listen } from "screens/data_containers/utils";
import { Addition } from "screens/data_containers/bvrs/addition";

export const newItemsAreFollowedWhenConfirmed = (ctr: any) => {
  const addition = Addition.get(ctr);
  listen(addition, "confirm", function(data: any) {
    Labelling.get(ctr).setLabel("following", addition.item.id, true);
  });
};
