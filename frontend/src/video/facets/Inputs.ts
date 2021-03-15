import { Display } from 'src/session/facets/Display';
import { observable } from 'mobx';
import { UserProfileT } from 'src/profiles/types';
import { MoveListT } from 'src/movelists/types';

export class Inputs {
  @observable sessionDisplay?: Display;
  @observable userProfile?: UserProfileT;
  @observable moveList?: MoveListT;

  static get = (ctr: any): Inputs => ctr.inputs;
}

export function initInputs(self: Inputs): Inputs {
  return self;
}
