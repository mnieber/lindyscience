// @flow

import { behaviour_impl, data, operation } from "facets/index";
import { observable, runInAction } from "utils/mobx_wrapper";
import type { UserProfileT } from "profiles/types";
import Cookies from "js-cookie";

// $FlowFixMe
@behaviour_impl
export class SessionData {
  @data userProfile: ?UserProfileT;
  @observable signedInEmail: ?string;
  @observable dispatch: Function;
  @observable history: any;
  @observable selectedMoveListUrl: string;
  @observable loadedMoveListUrls: Array<string> = [];
  @observable notFoundMoveListUrls: Array<string> = [];
  @observable acceptsCookies: boolean = false;

  // $FlowFixMe
  @operation loadEmail() {}
  // $FlowFixMe
  @operation signOut() {}
  // $FlowFixMe
  @operation acceptCookies() {}
}

function _handleAcceptCookies(self: SessionData) {
  Cookies.set("acceptCookies", "1");
  runInAction(() => {
    self.acceptsCookies = true;
  });
}

export function initSessionData(
  self: SessionData,
  dispatch: Function,
  history: any
): SessionData {
  _handleAcceptCookies(self);
  runInAction(() => {
    self.dispatch = dispatch;
    self.acceptsCookies = Cookies.get("acceptCookies") === "1";
  });
  return self;
}
