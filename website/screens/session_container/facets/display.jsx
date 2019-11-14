// @flow

import { createUUID } from "utils/utils";
import { observable, computed, runInAction } from "utils/mobx_wrapper";
import { type GetFacet, facetClass, operation } from "facet";

// $FlowFixMe
@facetClass
export class Display {
  @observable width: number;
  // $FlowFixMe
  @computed get small() {
    return this.width < this.smallBreakPoint;
  }

  @observable smallBreakPoint: number = 1200;
  @observable id: string;

  // $FlowFixMe
  @operation setWidth(x) {
    if (x !== this.width) {
      runInAction(() => {
        this.width = x;
      });
    }
  }

  static get: GetFacet<Display>;
}

export function initDisplay(self: Display): Display {
  self.id = createUUID();
  return self;
}
