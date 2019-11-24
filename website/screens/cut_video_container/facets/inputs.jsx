// @flow

import { runInAction, observable } from "utils/mobx_wrapper";
import { Display as SessionDisplay } from "screens/session_container/facets/display";
import { type GetFacet, facetClass } from "facet";
import type { UserProfileT } from "profiles/types";
import type { MoveListT } from "move_lists/types";

// $FlowFixMe
@facetClass
export class Inputs {
  @observable sessionDisplay: ?SessionDisplay;
  @observable userProfile: ?UserProfileT;
  @observable moveList: ?MoveListT;
  static get: GetFacet<Inputs>;
}

export function initInputs(self: Inputs): Inputs {
  runInAction("initInputs", () => {});
  return self;
}
