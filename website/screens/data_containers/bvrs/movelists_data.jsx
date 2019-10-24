// @flow

import {
  type GetBvrT,
  behaviour_impl,
  data,
} from "screens/data_containers/utils";
import { computed, observable } from "utils/mobx_wrapper";
import type { UserProfileT } from "profiles/types";
import type { MoveListT } from "move_lists/types";
import type { UUID } from "kernel/types";
import { listToItemById } from "utils/utils";

// $FlowFixMe
@behaviour_impl
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
  @observable preview: Array<MoveListT> = [];
  @observable _userProfile: ?UserProfileT;

  @data display: Array<MoveListT> = [];

  static get: GetBvrT<MoveListsData>;
}

export function createMoveListsData() {
  return new MoveListsData();
}
