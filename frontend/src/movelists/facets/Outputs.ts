import { keys } from 'lodash/fp';
import { computed } from 'mobx';
import { MoveListT, MoveListByIdT } from 'src/movelists/types';
import { listToItemById } from 'src/utils/utils';
import { output } from 'skandha';

export class Outputs {
  @computed get moveListIds(): Array<string> {
    return keys(this.moveListById);
  }
  @computed get moveListById(): MoveListByIdT {
    return listToItemById(this.display);
  }
  @output display: Array<MoveListT> = [];
}
