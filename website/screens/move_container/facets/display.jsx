// @flow

import { observable } from "utils/mobx_wrapper";
import { type GetFacet, facetClass } from "facet";

// $FlowFixMe
@facetClass
export class Display {
  @observable videoPanelWidth: number;
  @observable videoWidth: number;
  @observable rootDivId: string;
  static get: GetFacet<Display>;
}

export function initDisplay(self: Display, rootDivId: string): Display {
  self.rootDivId = rootDivId;
  return self;
}
