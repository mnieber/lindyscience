// @flow

import { output } from 'src/facet';
import { computed, observable } from 'src/utils/mobx_wrapper';
import type { UUID } from 'src/kernel/types';
import { listToItemById } from 'src/utils/utils';
import type { MoveT } from 'src/moves/types';

export class Outputs {
  @observable preview: Array<MoveT> = [];
  @output display: Array<MoveT> = [];

  @computed get moveIds(): Array<UUID> {
    return Object.keys(this.moveById);
  }
  @computed get moveById(): { [UUID]: MoveT } {
    return listToItemById(this.preview);
  }

  static get = (ctr: any): Outputs => ctr.outputs;
}

export function initOutputs(self: Outputs): Outputs {
  return self;
}
