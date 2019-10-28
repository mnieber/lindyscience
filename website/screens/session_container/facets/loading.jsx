// @flow

import { type GetBvrT, facetClass } from "facet/index";
import { observable } from "utils/mobx_wrapper";

// $FlowFixMe
@facetClass
export class Loading {
  @observable loadedMoveListUrls: Array<string> = [];
  @observable notFoundMoveListUrls: Array<string> = [];

  static get: GetBvrT<Loading>;
}

export function initLoading(self: Loading): Loading {
  return self;
}
