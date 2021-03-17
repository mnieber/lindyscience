import { computed } from 'mobx';
import { MoveListT } from 'src/movelists/types';
import { UserProfileT } from 'src/profiles/types';
import { operation, input } from 'skandha';

export class Inputs {
  @input moveLists: Array<MoveListT> = [];
  @input userProfile?: UserProfileT;

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
}
