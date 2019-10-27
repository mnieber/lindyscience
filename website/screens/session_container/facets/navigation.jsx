// @flow

import type { UUID } from "kernel/types";
import { type GetBvrT, behaviour_impl } from "facets/index";
import { observable, runInAction, computed } from "utils/mobx_wrapper";

export type UrlParamsT = {
  ownerUsername: ?string,
  moveListSlug: ?string,
  moveSlug: ?string,
  moveId: ?UUID,
};

// $FlowFixMe
@behaviour_impl
export class Navigation {
  @observable history: any;
  @observable ignoreHighlightChanges: boolean = false;
  @observable urlParams: UrlParamsT;

  // $FlowFixMe
  @computed get selectedMoveListUrl() {
    return this.urlParams &&
      this.urlParams.ownerUsername &&
      this.urlParams.moveListSlug
      ? this.urlParams.ownerUsername + "/" + this.urlParams.moveListSlug
      : undefined;
  }

  static get: GetBvrT<Navigation>;
}

export function initNavigation(self: Navigation, history: any): Navigation {
  runInAction("initNavigation", () => {
    self.history = history;
  });
  return self;
}
