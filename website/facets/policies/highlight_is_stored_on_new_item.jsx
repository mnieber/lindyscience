// @flow

import { listen } from "facets/index";
import { Addition } from "facets/generic/addition";

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
