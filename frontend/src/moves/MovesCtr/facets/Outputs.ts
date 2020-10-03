import { computed, observable } from 'src/utils/mobx_wrapper';
import { MoveT } from 'src/moves/types';
import { UUID } from 'src/kernel/types';
import { listToItemById } from 'src/utils/utils';
import { output } from 'src/npm/facet';

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
