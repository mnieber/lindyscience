// @flow

import { createUUID } from "utils/utils";
import { observable, runInAction } from "utils/mobx_wrapper";
import { type GetFacet, facetClass, operation } from "facet";

// $FlowFixMe
@facetClass
export class Display {
  @observable small: boolean = false;
  @observable smallBreakPoint: number = 1200;
  @observable id: string;

  // $FlowFixMe
  @operation showSmall(flag) {
    if (flag !== this.small) {
      runInAction(() => {
        this.small = flag;
      });
    }
  }

  static get: GetFacet<Display>;
}

export function initDisplay(self: Display): Display {
  self.id = createUUID();
  return self;
}
