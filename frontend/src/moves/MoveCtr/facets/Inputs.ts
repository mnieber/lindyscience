import { Display } from 'src/session/facets/Display';
import { observable } from 'mobx';
import { MovePrivateDataT, MoveT } from 'src/moves/types';

export class Inputs {
  @observable move?: MoveT;
  @observable movePrivateData?: MovePrivateDataT;
  @observable sessionDisplay?: Display;
  @observable altLink?: string;

  static get = (ctr: any): Inputs => ctr.inputs;
}

export function initInputs(self: Inputs): Inputs {
  return self;
}
