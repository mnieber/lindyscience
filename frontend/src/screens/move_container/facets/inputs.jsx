// @flow

import type { MovePrivateDataT, MoveT } from 'src/moves/types';
import { Display as SessionDisplay } from 'src/screens/session_container/facets/display';
import { observable, runInAction } from 'src/utils/mobx_wrapper';

export class Inputs {
  @observable move: ?MoveT;
  @observable movePrivateData: ?MovePrivateDataT;
  @observable sessionDisplay: ?SessionDisplay;
  @observable altLink: string;

  static get = (ctr: any): Inputs => ctr.inputs;
}

export function initInputs(self: Inputs): Inputs {
  runInAction('initInputs', () => {});
  return self;
}
