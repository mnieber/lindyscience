// @flow

import Cookies from "js-cookie";

import type { GetBvrT } from "facets/index";
import { behaviour_impl, data, operation } from "facets/index";
import { observable, runInAction } from "utils/mobx_wrapper";
import type { UserProfileT } from "profiles/types";

// $FlowFixMe
@behaviour_impl
export class Loading {
  @observable loadedMoveListUrls: Array<string> = [];
  @observable notFoundMoveListUrls: Array<string> = [];

  static get: GetBvrT<Loading>;
}

export function initLoading(self: Loading): Loading {
  runInAction(() => {});
  return self;
}
