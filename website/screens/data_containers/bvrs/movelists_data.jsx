// @flow

import {
  type GetBvrT,
  behaviour_impl,
  createPatch,
  data,
} from "screens/data_containers/utils";
import { Selection } from "screens/data_containers/bvrs/selection";
import { computed, observable } from "utils/mobx_wrapper";
import type { UserProfileT } from "profiles/types";
import type { MoveListT } from "move_lists/types";
import type { UUID } from "kernel/types";
import { listToItemById } from "utils/utils";

// $FlowFixMe
@behaviour_impl
export class MoveListsData {
  // TODO: for internal purposes. Rename to _userProfile
  @observable userProfile: ?UserProfileT;
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

  @data display: Array<MoveListT> = [];

  static get: GetBvrT<MoveListsData>;
}

export function createMoveListsData() {
  return new MoveListsData();
}

export const previewedItemsAreDisplayed = createPatch(
  MoveListsData,
  [],
  () => ({
    get display() {
      return this.preview;
    },
  })
);

export const displayedItemsCanBeSelected = createPatch(
  Selection,
  [MoveListsData],
  (data: MoveListsData) => ({
    get selectableIds() {
      return data.display.map(x => x.id);
    },
  })
);
