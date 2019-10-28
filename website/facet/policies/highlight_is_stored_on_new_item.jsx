// @flow

import { listen } from "facet/index";
import { Addition } from "facet/facets/addition";

export const highlightIsStoredOnNewItem = (storeHighlight: Function) => (
  ctr: any
) => {
  listen(Addition.get(ctr), "add", () => storeHighlight());
};

export const highlightIsRestoredOnCancelNewItem = (
  restoreHighlight: Function
) => (ctr: any) => {
  listen(Addition.get(ctr), "cancel", () => restoreHighlight());
};
