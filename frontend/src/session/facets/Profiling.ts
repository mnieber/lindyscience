// @flow

import Cookies from 'js-cookie';

import { action, observable, runInAction } from 'src/utils/mobx_wrapper';
import { UserProfileT } from 'src/profiles/types';
import { OwnedT, UUID } from 'src/kernel/types';
import { isOwner } from 'src/app/utils';
import { data, installHandlers, operation } from 'src/npm/facet';

export class Profiling {
  @data @observable userProfile: ?UserProfileT;
  @data @observable signedInEmail: ?string;
  @data @observable acceptsCookies: boolean = false;

  @action setFollowedMoveListIds(moveListIds: Array<UUID>) {
    if (this.userProfile) {
      this.setUserProfile({
        ...this.userProfile,
        moveListIds,
      });
    }
  }

  @action setUserProfile(userProfile: ?UserProfileT) {
    this.userProfile = userProfile;
  }

  isOwner(x: OwnedT) {
    return this.userProfile && isOwner(this.userProfile, x.ownerId);
  }

  @operation loadEmail() {}
  @operation signIn(userName: string, password: string): Promise<any> {
    return Promise.resolve();
  }
  @operation signOut(): Promise<any> {
    return Promise.resolve();
  }
  @operation acceptCookies() {}

  static get = (ctr: any): Profiling => ctr.profiling;
}

const _handleAcceptCookies = (self: Profiling) => () => {
  Cookies.set('acceptCookies', '1');
  runInAction('acceptCookies', () => {
    self.acceptsCookies = true;
  });
};

export function initProfiling(self: Profiling): Profiling {
  installHandlers(
    {
      acceptCookies: _handleAcceptCookies,
    },
    self
  );
  runInAction('initProfiling', () => {
    self.acceptsCookies = Cookies.get('acceptCookies') === '1';
  });
  return self;
}
