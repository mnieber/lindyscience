import { computed, observable } from 'src/utils/mobx_wrapper';
import { MoveListT } from 'src/move_lists/types';
import { UserProfileT } from 'src/profiles/types';
import { operation, input } from 'facility';

export class Inputs {
  @observable @input moveLists: Array<MoveListT> = [];
  @observable @input userProfile?: UserProfileT;

  @computed get moveListsFollowing(): Array<MoveListT> {
    const userProfile = this.userProfile;
    return userProfile
      ? this.moveLists.filter((x) => userProfile.moveListIds.includes(x.id))
      : [];
  }

  @operation setMoveLists(moveLists: Inputs['moveLists']) {
    this.moveLists = moveLists;
  }

  @operation setUserProfile(userProfile: Inputs['userProfile']) {
    this.userProfile = userProfile;
  }

  static get = (ctr: any): Inputs => ctr.inputs;
}

export function initInputs(self: Inputs): Inputs {
  return self;
}
