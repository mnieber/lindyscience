import { Display } from 'src/app/Display';
import { observable } from 'mobx';
import { MovePrivateDataT, MoveT } from 'src/moves/types';

export class Inputs {
  @observable move?: MoveT;
  @observable movePrivateData?: MovePrivateDataT;
  @observable sessionDisplay?: Display;
  @observable altLink?: string;
}
