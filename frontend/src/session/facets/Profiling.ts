import Cookies from 'js-cookie';

import { RST, resetRS } from 'src/utils/RST';
import { action, observable, runInAction } from 'src/utils/mobx_wrapper';
import { UserProfileT } from 'src/profiles/types';
import { OwnedT, UUID } from 'src/kernel/types';
import { isOwner } from 'src/app/utils';
import { data, operation } from 'facility';

export class Profiling {
  @data @observable userProfile?: UserProfileT;
  @observable userProfileRS: RST = resetRS();
  @data @observable acceptsCookies: boolean = false;

  @action setFollowedMoveListIds(moveListIds: Array<UUID>) {
    if (this.userProfile) {
      this.setUserProfile(
        {
          ...this.userProfile,
          moveListIds,
        },
        this.userProfileRS
      );
    }
  }

  @action setUserProfile(
    userProfile: UserProfileT | undefined,
    userProfileRS: RST
  ) {
    this.userProfile = userProfile;
    this.userProfileRS = userProfileRS;
  }

  isOwner(x: OwnedT) {
    return this.userProfile && isOwner(this.userProfile, x.ownerId);
  }

  @operation acceptCookies() {
    Cookies.set('acceptCookies', '1');
    this.acceptsCookies = true;
  }

  static get = (ctr: any): Profiling => ctr.profiling;
}

export function initProfiling(self: Profiling): Profiling {
  runInAction(() => {
    self.acceptsCookies = Cookies.get('acceptCookies') === '1';
  });
  return self;
}
