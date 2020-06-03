// @flow

import { runInAction, observable } from 'src/utils/mobx_wrapper';
import { Display as SessionDisplay } from 'src/screens/session_container/facets/display';
import type { UserProfileT } from 'src/profiles/types';
import type { MoveListT } from 'src/move_lists/types';

export class Inputs {
  @observable sessionDisplay: ?SessionDisplay;
  @observable userProfile: ?UserProfileT;
  @observable moveList: ?MoveListT;

  static get = (ctr: any): Inputs => ctr.inputs;
}

export function initInputs(self: Inputs): Inputs {
  runInAction('initInputs', () => {});
  return self;
}
