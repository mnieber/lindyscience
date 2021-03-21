import { keys } from 'lodash/fp';
import { computed } from 'mobx';
import { MoveT, MoveByIdT } from 'src/moves/types';
import { listToItemById } from 'src/utils/utils';
import { output } from 'skandha';

export class Outputs {
  @output display: Array<MoveT> = [];

  @computed get moveById(): MoveByIdT {
    return listToItemById(this.display);
  }

  @computed get moveIds(): Array<string> {
    return keys(this.moveById);
  }
}
