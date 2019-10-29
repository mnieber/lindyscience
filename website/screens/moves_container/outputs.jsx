// @flow

import { computed, observable } from "utils/mobx_wrapper";
import type { UUID } from "kernel/types";
import { listToItemById } from "utils/utils";
import { type GetFacet, facetClass, output } from "facet";
import type { MoveT } from "moves/types";

// $FlowFixMe
@facetClass
export class Outputs {
  @observable preview: Array<MoveT> = [];
  @output display: Array<MoveT> = [];

  // $FlowFixMe
  @computed get moveIds(): Array<UUID> {
    return Object.keys(this.moveById);
  }
  // $FlowFixMe
  @computed get moveById(): { [UUID]: MoveT } {
    return listToItemById(this.preview);
  }

  static get: GetFacet<Outputs>;
}

export function initOutputs(self: Outputs): Outputs {
  return self;
}
