import { computed, observable } from 'mobx';
import { TipT, TipByIdT } from 'src/tips/types';
import { UUID } from 'src/kernel/types';
import { listToItemById } from 'src/utils/utils';
import { keys } from 'lodash/fp';
import { data } from 'skandha';

export class Outputs {
  @observable @data display: Array<TipT> = [];

  @computed get tipIds(): Array<UUID> {
    return keys(this.tipById);
  }
  @computed get tipById(): TipByIdT {
    return listToItemById(this.display);
  }
}
