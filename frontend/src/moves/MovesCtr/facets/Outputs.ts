import { computed, observable } from 'mobx';
import { MoveT, MoveByIdT } from 'src/moves/types';
import { listToItemById } from 'src/utils/utils';
import { output } from 'skandha';

export class Outputs {
  @observable @output preview: Array<MoveT> = [];
  @output display: Array<MoveT> = [];

  @computed get moveById(): MoveByIdT {
    return listToItemById(this.preview);
  }
}

export function initOutputs(self: Outputs): Outputs {
  return self;
}
