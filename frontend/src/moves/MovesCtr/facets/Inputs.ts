import { observable } from 'src/utils/mobx_wrapper';
import { MoveT } from 'src/moves/types';
import { UserProfileT } from 'src/profiles/types';
import { MoveListT } from 'src/move_lists/types';

export class Inputs {
  @observable moves: Array<MoveT> = [];
  @observable userProfile?: UserProfileT;
  @observable moveList?: MoveListT;
  @observable moveLists: Array<MoveListT> = [];

  static get = (ctr: any): Inputs => ctr.inputs;
}

export function initInputs(self: Inputs): Inputs {
  return self;
}