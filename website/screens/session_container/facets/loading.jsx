// @flow

import { type GetBvrT, behaviour_impl } from "facets/index";
import { observable } from "utils/mobx_wrapper";

// $FlowFixMe
@behaviour_impl
export class Loading {
  @observable loadedMoveListUrls: Array<string> = [];
  @observable notFoundMoveListUrls: Array<string> = [];

  static get: GetBvrT<Loading>;
}

export function initLoading(self: Loading): Loading {
  return self;
}
