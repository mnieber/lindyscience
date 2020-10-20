import { MoveT } from 'src/moves/types';
import { UserProfileT } from 'src/profiles/types';
import { observable, runInAction } from 'src/utils/mobx_wrapper';

export class Inputs {
  @observable move?: MoveT;
  @observable userProfile?: UserProfileT;

  static get = (ctr: any): Inputs => ctr.inputs;
}

export function initInputs(self: Inputs): Inputs {
  runInAction('initInputs', () => {});
  return self;
}
