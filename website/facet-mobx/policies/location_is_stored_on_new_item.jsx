// @flow

import { listen } from "facet";
import { Addition } from "facet-mobx/facets/addition";

export const locationIsStoredOnNewItem = (storeLocation: Function) => (
  ctr: any
) => {
  listen(Addition.get(ctr), "add", () => {
    storeLocation();
  });
};

export const locationIsRestoredOnCancelNewItem = (
  restoreLocation: Function
) => (ctr: any) => {
  listen(Addition.get(ctr), "cancel", () => restoreLocation());
};