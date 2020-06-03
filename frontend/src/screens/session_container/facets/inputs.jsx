// @flow

import type { MoveListT } from 'src/move_lists/types';
import { observable, runInAction } from 'src/utils/mobx_wrapper';

export class Inputs {
  @observable moveLists: Array<MoveListT>;

  static get = (ctr: any): Inputs => ctr.inputs;
}

export function initInputs(self: Inputs): Inputs {
  runInAction('initInputs', () => {});
  return self;
}
