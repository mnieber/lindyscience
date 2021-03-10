import Cookies from 'js-cookie';

import { RST, resetRS } from 'src/utils/RST';
import { action, observable, runInAction } from 'mobx';
import { UserProfileT } from 'src/profiles/types';
import { OwnedT, UUID } from 'src/kernel/types';
import { isOwner } from 'src/app/utils';
import { data, operation } from 'facility';

export class ProfilingStore {
  @data @observable userProfile?: UserProfileT;
  @observable userProfileRS: RST = resetRS();
  @data @observable acceptsCookies: boolean = false;

  constructor() {
    runInAction(() => {
      this.acceptsCookies = Cookies.get('acceptCookies') === '1';
    });
  }

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
}
