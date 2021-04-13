import { Display } from 'src/app/Display';
import { observable } from 'mobx';
import { UserProfileT } from 'src/profiles/types';
import { MoveListT } from 'src/movelists/types';

export class Inputs {
  @observable sessionDisplay?: Display;
  @observable userProfile?: UserProfileT;
  @observable moveList?: MoveListT;
}
