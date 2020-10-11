import { computed, observable } from 'src/utils/mobx_wrapper';
import { MoveListT } from 'src/move_lists/types';
import { UserProfileT } from 'src/profiles/types';

export class Inputs {
  @observable moveLists: Array<MoveListT> = [];
  @observable userProfile?: UserProfileT;

  @computed get moveListsFollowing(): Array<MoveListT> {
    const userProfile = this.userProfile;
    return userProfile
      ? this.moveLists.filter((x) => userProfile.moveListIds.includes(x.id))
      : [];
  }

  static get = (ctr: any): Inputs => ctr.inputs;
}

export function initInputs(self: Inputs): Inputs {
  return self;
}