// @flow

import Cookies from "js-cookie";

import type { GetBvrT } from "facets/index";
import { behaviour_impl, data, operation } from "facets/index";
import { observable, runInAction } from "utils/mobx_wrapper";
import type { UserProfileT } from "profiles/types";

// $FlowFixMe
@behaviour_impl
export class SessionData {
  @observable dispatch: Function;

  static get: GetBvrT<SessionData>;
}

export function initSessionData(
  self: SessionData,
  dispatch: Function
): SessionData {
  runInAction(() => {
    self.dispatch = dispatch;
  });
  return self;
}
