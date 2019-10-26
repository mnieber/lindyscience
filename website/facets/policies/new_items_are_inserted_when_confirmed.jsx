// @flow

import { listen } from "facets/index";
import { Addition } from "facets/generic/addition";
import { action } from "utils/mobx_wrapper";
import { Insertion } from "facets/generic/insertion";

export const newItemsAreInsertedWhenConfirmed = (ctr: any) => {
  listen(
    Addition.get(ctr),
    "confirm",
    action(function() {
      Insertion.get(ctr).insertPayload();
      Addition.get(ctr).item = undefined;
      Addition.get(ctr).parentId = undefined;
    })
  );
};
