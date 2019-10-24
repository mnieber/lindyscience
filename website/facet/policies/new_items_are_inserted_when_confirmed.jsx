// @flow

import { listen } from "facet/index";
import { Addition } from "facet/facets/addition";
import { action } from "utils/mobx_wrapper";
import { Insertion } from "facet/facets/insertion";

export const newItemsAreInsertedWhenConfirmed = (ctr: any) => {
  listen(
    Addition.get(ctr),
    "confirm",
    action("insertItemWhenConfirmed", function() {
      Insertion.get(ctr).insertPayload();
      Addition.get(ctr).item = undefined;
      Addition.get(ctr).parentId = undefined;
    })
  );
};
