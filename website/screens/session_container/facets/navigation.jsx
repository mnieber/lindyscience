// @flow

import { type GetBvrT, behaviour_impl } from "facets/index";
import { observable, runInAction } from "utils/mobx_wrapper";

// $FlowFixMe
@behaviour_impl
export class Navigation {
  @observable history: any;
  @observable selectedMoveListUrl: string;
  @observable requestedMoveListUrl: string;

  static get: GetBvrT<Navigation>;
}

export function initNavigation(self: Navigation, history: any): Navigation {
  runInAction(() => {
    self.history = history;
  });
  return self;
}
