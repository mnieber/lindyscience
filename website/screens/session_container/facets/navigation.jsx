// @flow

import { Selection } from "facet-mobx/facets/selection";
import { makeSlugid } from "screens/utils";
import type { MoveT } from "moves/types";
import type { MoveListT } from "move_lists/types";
import { action, computed, observable, runInAction } from "utils/mobx_wrapper";
import type { UUID } from "kernel/types";
import { type GetFacet, facetClass, listen, operation } from "facet";

export type DataRequestT = {
  moveSlugid?: string,
  moveListUrl?: string,
  profileUrl?: string,
};

const createDataRequestMap = (createValue: Function) => ({
  moveSlugid: createValue(),
  moveListUrl: createValue(),
  profileUrl: createValue(),
});

// $FlowFixMe
@facetClass
export class Navigation {
  @observable history: any;
  @observable locationMemo: string;
  @observable dataRequest: DataRequestT = {};
  @observable loadedData = createDataRequestMap(() => []);
  @observable notFoundData = createDataRequestMap(() => []);

  // $FlowFixMe
  @operation requestData(dataRequest: DataRequestT) {}
  // $FlowFixMe
  @operation navigateToMove(move: MoveT) {}
  // $FlowFixMe
  @operation navigateToMoveList(moveList: MoveListT) {}
  // $FlowFixMe
  @operation storeLocation() {}
  // $FlowFixMe
  @operation restoreLocation() {}

  static get: GetFacet<Navigation>;
}

function _handleRequestData(self: Navigation) {
  listen(
    self,
    "requestData",
    action("requestData", (dataRequest: DataRequestT) => {
      self.dataRequest = dataRequest;
    })
  );
}

function _handleStoreAndRestoreLocation(self: Navigation) {
  listen(
    self,
    "storeLocation",
    action("storeLocation", () => {
      self.locationMemo = window.location.pathname;
    })
  );
  listen(self, "restoreLocation", () => {
    self.history.push(self.locationMemo);
  });
}

export function initNavigation(self: Navigation, history: any): Navigation {
  runInAction("initNavigation", () => {
    self.history = history;
  });
  _handleRequestData(self);
  _handleStoreAndRestoreLocation(self);
  return self;
}

export const ensureSelected = (selection: Selection, id: any) => {
  if (!selection.ids.includes(id)) {
    selection.selectItem({
      itemId: id,
      isShift: false,
      isCtrl: false,
    });
  }
};

export const getStatus = (self: Navigation) => {
  const entries = Object.entries(self.dataRequest);
  return entries.reduce(
    (acc, [resourceName, url]) => {
      return {
        ...acc,
        [resourceName]: {
          hasLoaded: self.loadedData[resourceName].includes(url),
          notFound: self.notFoundData[resourceName].includes(url),
        },
      };
    },
    createDataRequestMap(() => ({ hasLoaded: false, notFound: false }))
  );
};
