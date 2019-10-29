// @flow

import { Selection } from "facet/facets/selection";
import { makeSlugid } from "screens/utils";
import type { MoveT } from "moves/types";
import type { MoveListT } from "move_lists/types";
import { action, computed, observable, runInAction } from "utils/mobx_wrapper";
import type { UUID } from "kernel/types";
import { type GetFacet, facetClass, listen, operation } from "facet/index";

export type TargetT = {
  moveSlugid?: string,
  moveListUrl?: string,
  profileUrl?: string,
};

// $FlowFixMe
@facetClass
export class Navigation {
  @observable history: any;
  @observable locationMemo: string;
  @observable target: TargetT = {};

  // $FlowFixMe
  @operation setTarget(target: TargetT) {}
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

function _handleSetTarget(self: Navigation) {
  listen(
    self,
    "setTarget",
    action("setTarget", (target: TargetT) => {
      self.target = target;
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
  _handleSetTarget(self);
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
