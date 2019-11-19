// @flow

import { Display as SessionDisplay } from "screens/session_container/facets/display";
import type { MoveT } from "moves/types";
import { observable, runInAction } from "utils/mobx_wrapper";
import { type GetFacet, facetClass } from "facet";

// $FlowFixMe
@facetClass
export class Inputs {
  @observable move: ?MoveT;
  @observable sessionDisplay: ?SessionDisplay;
  @observable altLink: string;
  static get: GetFacet<Inputs>;
}

export function initInputs(self: Inputs): Inputs {
  runInAction("initInputs", () => {});
  return self;
}
