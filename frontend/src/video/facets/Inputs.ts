// @flow

import { Display } from 'src/session/facets/Display';
import { observable, runInAction } from 'src/utils/mobx_wrapper';
import { UserProfileT } from 'src/profiles/types';
import { MoveListT } from 'src/move_lists/types';

export class Inputs {
  @observable sessionDisplay: ?Display;
  @observable userProfile: ?UserProfileT;
  @observable moveList: ?MoveListT;

  static get = (ctr: any): Inputs => ctr.inputs;
}

export function initInputs(self: Inputs): Inputs {
  runInAction('initInputs', () => {});
  return self;
}
