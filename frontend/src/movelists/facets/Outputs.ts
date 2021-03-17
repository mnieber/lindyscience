import { keys } from 'lodash/fp';
import { computed } from 'mobx';
import { UUID } from 'src/kernel/types';
import { MoveListT, MoveListByIdT } from 'src/movelists/types';
import { listToItemById } from 'src/utils/utils';
import { output } from 'skandha';

export class Outputs {
  @output @computed get moveListIds(): Array<UUID> {
    return keys(this.moveListById);
  }
  @output @computed get moveListById(): MoveListByIdT {
    return listToItemById(this.display);
  }
  @output display: Array<MoveListT> = [];
}
