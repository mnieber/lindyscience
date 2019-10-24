// @flow

import { type GetBvrT, facetClass, data } from "facet/index";
import { computed, observable } from "utils/mobx_wrapper";
import type { UserProfileT } from "profiles/types";
import type { MoveListT } from "move_lists/types";
import type { UUID } from "kernel/types";
import { listToItemById } from "utils/utils";

// $FlowFixMe
@facetClass
export class Inputs {
  @observable moveLists: Array<MoveListT> = [];
  @observable userProfile: ?UserProfileT;

  // $FlowFixMe
  @computed get moveListsFollowing(): Array<MoveListT> {
    const userProfile = this.userProfile;
    return userProfile
      ? this.moveLists.filter(x => userProfile.moveListIds.includes(x.id))
      : [];
  }

  static get: GetBvrT<Inputs>;
}

export function initInputs(self: Inputs): Inputs {
  return self;
}
