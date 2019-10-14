// @flow

import { listen } from "screens/data_containers/utils";
import { Addition } from "screens/data_containers/bvrs/addition";

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
