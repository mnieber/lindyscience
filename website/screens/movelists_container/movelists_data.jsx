// @flow

import { type GetBvrT, facetClass, data } from "facets/index";
import { computed, observable } from "utils/mobx_wrapper";
import type { UserProfileT } from "profiles/types";
import type { MoveListT } from "move_lists/types";
import type { UUID } from "kernel/types";
import { listToItemById } from "utils/utils";

// $FlowFixMe
@facetClass
export class MoveListsData {
  @observable moveLists: Array<MoveListT> = [];
  // $FlowFixMe
  @computed get moveListIds(): Array<UUID> {
    return Object.keys(this.moveListById);
  }
  // $FlowFixMe
  @computed get moveListById(): { [UUID]: MoveListT } {
    return listToItemById(this.preview);
  }
  // $FlowFixMe
  @computed get moveListsFollowing(): Array<MoveListT> {
    const userProfile = this._userProfile;
    return userProfile
      ? this.preview.filter(x => userProfile.moveListIds.includes(x.id))
      : [];
  }
  @observable preview: Array<MoveListT> = [];
  @observable _userProfile: ?UserProfileT;

  @data display: Array<MoveListT> = [];

  static get: GetBvrT<MoveListsData>;
}

export function initMoveListsData(self: MoveListsData): MoveListsData {
  return self;
}
