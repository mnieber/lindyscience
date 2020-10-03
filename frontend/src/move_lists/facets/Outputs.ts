import { keys } from 'lodash/fp';
import { computed, observable } from 'src/utils/mobx_wrapper';
import { UUID } from 'src/kernel/types';
import { MoveListT, MoveListByIdT } from 'src/move_lists/types';
import { listToItemById } from 'src/utils/utils';
import { output } from 'src/npm/facet';

export class Outputs {
  @computed get moveListIds(): Array<UUID> {
    return keys(this.moveListById);
  }
  @computed get moveListById(): MoveListByIdT {
    return listToItemById(this.preview);
  }
  @observable preview: Array<MoveListT> = [];
  @output display: Array<MoveListT> = [];

  static get = (ctr: any): Outputs => ctr.outputs;
}

export function initOutputs(self: Outputs): Outputs {
  return self;
}
