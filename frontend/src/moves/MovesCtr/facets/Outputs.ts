import { computed, observable } from 'mobx';
import { MoveT, MoveByIdT } from 'src/moves/types';
import { listToItemById } from 'src/utils/utils';
import { output } from 'facility';

export class Outputs {
  @observable @output preview: Array<MoveT> = [];
  @output display: Array<MoveT> = [];

  @computed get moveById(): MoveByIdT {
    return listToItemById(this.preview);
  }

  static get = (ctr: any): Outputs => ctr.outputs;
}

export function initOutputs(self: Outputs): Outputs {
  return self;
}
