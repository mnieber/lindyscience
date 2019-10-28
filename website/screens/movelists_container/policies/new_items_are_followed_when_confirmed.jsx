// @flow

import { Labelling } from "facet/facets/labelling";
import { listen } from "facet/index";
import { Addition } from "facet/facets/addition";

export const newItemsAreFollowedWhenConfirmed = (ctr: any) => {
  const addition = Addition.get(ctr);
  listen(addition, "confirm", function(data: any) {
    Labelling.get(ctr).setLabel({
      label: "following",
      id: addition.item.id,
      flag: true,
    });
  });
};
