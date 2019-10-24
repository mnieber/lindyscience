// @flow

import Cookies from "js-cookie";

import type { GetBvrT } from "facet/index";
import { facetClass, data, operation } from "facet/index";
import { observable, runInAction } from "utils/mobx_wrapper";

// $FlowFixMe
@facetClass
export class Profiling {
  @observable signedInEmail: ?string;
  @observable acceptsCookies: boolean = false;

  // $FlowFixMe
  @operation loadEmail() {}
  // $FlowFixMe
  @operation signOut() {}
  // $FlowFixMe
  @operation acceptCookies() {}

  static get: GetBvrT<Profiling>;
}

function _handleAcceptCookies(self: Profiling) {
  Cookies.set("acceptCookies", "1");
  runInAction("acceptCookies", () => {
    self.acceptsCookies = true;
  });
}

export function initProfiling(self: Profiling): Profiling {
  _handleAcceptCookies(self);
  runInAction("initProfiling", () => {
    self.acceptsCookies = Cookies.get("acceptCookies") === "1";
  });
  return self;
}
