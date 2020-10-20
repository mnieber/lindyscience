import { computed, observable } from 'src/utils/mobx_wrapper';
import { TipT, TipByIdT } from 'src/tips/types';
import { UUID } from 'src/kernel/types';
import { listToItemById } from 'src/utils/utils';
import { keys } from 'lodash/fp';

export class Outputs {
  @observable preview: Array<TipT> = [];
  @observable display: Array<TipT> = [];

  @computed get tipIds(): Array<UUID> {
    return keys(this.tipById);
  }
  @computed get tipById(): TipByIdT {
    return listToItemById(this.preview);
  }

  static get = (ctr: any): Outputs => ctr.outputs;
}

export function initOutputs(self: Outputs): Outputs {
  return self;
}
