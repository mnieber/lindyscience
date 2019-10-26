// @flow

import { Labelling } from "facets/generic/labelling";
import { listen } from "facets/index";
import { Addition } from "facets/generic/addition";

export const newItemsAreFollowedWhenConfirmed = (ctr: any) => {
  const addition = Addition.get(ctr);
  listen(addition, "confirm", function(data: any) {
    Labelling.get(ctr).setLabel("following", addition.item.id, true);
  });
};
