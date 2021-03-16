import { TipT } from 'src/tips/types';
import { MoveT } from 'src/moves/types';
import { UserProfileT } from 'src/profiles/types';
import { observable } from 'mobx';
import { input } from 'skandha';

export class Inputs {
  @observable @input move?: MoveT;
  @observable @input tips?: TipT[];
  @observable @input userProfile?: UserProfileT;
}

export function initInputs(self: Inputs): Inputs {
  return self;
}
