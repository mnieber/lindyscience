// @flow

import { Selection } from "facet/facets/selection";
import { makeSlugid } from "screens/utils";
import type { MoveT } from "moves/types";
import type { MoveListT } from "move_lists/types";
import { action, computed, observable, runInAction } from "utils/mobx_wrapper";
import type { UUID } from "kernel/types";
import { type GetBvrT, facetClass, listen, operation } from "facet/index";

export type UrlParamsT = {
  ownerUsername: ?string,
  moveListSlug: ?string,
  moveSlug: ?string,
  moveId: ?UUID,
};

// $FlowFixMe
@facetClass
export class Navigation {
  @observable history: any;
  @observable urlParams: UrlParamsT;

  // $FlowFixMe
  @computed get moveListUrl() {
    return this.urlParams &&
      this.urlParams.ownerUsername &&
      this.urlParams.moveListSlug
      ? this.urlParams.ownerUsername + "/" + this.urlParams.moveListSlug
      : undefined;
  }

  // $FlowFixMe
  @computed get moveSlugId() {
    return this.urlParams && this.urlParams.moveSlug
      ? makeSlugid(this.urlParams.moveSlug, this.urlParams.moveId)
      : undefined;
  }

  // $FlowFixMe
  @operation setUrlParams(urlParams: UrlParamsT) {}
  // $FlowFixMe
  @operation navigateToMove(move: MoveT) {}
  // $FlowFixMe
  @operation navigateToMoveList(moveList: MoveListT) {}

  static get: GetBvrT<Navigation>;
}

function _handleSetUrlParams(self: Navigation) {
  listen(
    self,
    "setUrlParams",
    action("setUrlParams", (urlParams: UrlParamsT) => {
      self.urlParams = urlParams;
    })
  );
}

export function initNavigation(self: Navigation, history: any): Navigation {
  _handleSetUrlParams(self);
  runInAction("initNavigation", () => {
    self.history = history;
  });
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
