// @flow

import { output } from 'src/facet';
import { computed, observable } from 'src/utils/mobx_wrapper';
import type { MoveListT } from 'src/move_lists/types';
import type { UUID } from 'src/kernel/types';
import { listToItemById } from 'src/utils/utils';

export class Outputs {
  @computed get moveListIds(): Array<UUID> {
    return Object.keys(this.moveListById);
  }
  @computed get moveListById(): { [UUID]: MoveListT } {
    return listToItemById(this.preview);
  }
  @observable preview: Array<MoveListT> = [];
  @output display: Array<MoveListT> = [];

  static get = (ctr: any): Outputs => ctr.outputs;
}

export function initOutputs(self: Outputs): Outputs {
  return self;
}
