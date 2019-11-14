// @flow

import { createUUID } from "utils/utils";
import { observable, computed, runInAction } from "utils/mobx_wrapper";
import { type GetFacet, facetClass, operation } from "facet";

// $FlowFixMe
@facetClass
export class Display {
  @observable width: number;
  @observable fullVideoWidth: boolean = false;
  // $FlowFixMe
  @computed get maxVideoWidth() {
    return this.fullVideoWidth ? 1200 : 800;
  }
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
  // $FlowFixMe
  @operation setFullVideoWidth(x: boolean) {
    runInAction(() => {
      this.fullVideoWidth = x;
    });
  }

  static get: GetFacet<Display>;
}

export function initDisplay(self: Display): Display {
  self.id = createUUID();
  return self;
}
