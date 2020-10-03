import { computed, observable } from 'src/utils/mobx_wrapper';
import { MoveT, MoveByIdT } from 'src/moves/types';
import { UUID } from 'src/kernel/types';
import { listToItemById } from 'src/utils/utils';
import { output } from 'src/npm/facet';
import { keys } from 'lodash/fp';

export class Outputs {
  @observable preview: Array<MoveT> = [];
  @output display: Array<MoveT> = [];

  @computed get moveIds(): Array<UUID> {
    return keys(this.moveById);
  }
  @computed get moveById(): MoveByIdT {
    return listToItemById(this.preview);
  }

  static get = (ctr: any): Outputs => ctr.outputs;
}

export function initOutputs(self: Outputs): Outputs {
  return self;
}
