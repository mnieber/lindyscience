import { computed, observable } from 'src/utils/mobx_wrapper';
import { MoveT, MoveByIdT } from 'src/moves/types';
import { listToItemById } from 'src/utils/utils';
import { output } from 'facet';

export class Outputs {
  @observable preview: Array<MoveT> = [];
  @output display: Array<MoveT> = [];

  @computed get moveById(): MoveByIdT {
    return listToItemById(this.preview);
  }

  static get = (ctr: any): Outputs => ctr.outputs;
}

export function initOutputs(self: Outputs): Outputs {
  return self;
}
