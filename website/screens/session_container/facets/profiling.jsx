// @flow

import Cookies from "js-cookie";

import type { GetFacet } from "facet";
import { facetClass, operation, data } from "facet";
import { observable, runInAction } from "utils/mobx_wrapper";

// $FlowFixMe
@facetClass
export class Profiling {
  @data @observable signedInEmail: ?string;
  @data @observable acceptsCookies: boolean = false;

  // $FlowFixMe
  @operation loadEmail() {}
  // $FlowFixMe
  @operation signIn() {}
  // $FlowFixMe
  @operation signOut() {}
  // $FlowFixMe
  @operation acceptCookies() {}

  static get: GetFacet<Profiling>;
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
