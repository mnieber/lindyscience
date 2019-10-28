// @flow

import { listen } from "facet/index";
import { Addition } from "facet/generic/addition";
import { action } from "utils/mobx_wrapper";
import { Insertion } from "facet/generic/insertion";

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
