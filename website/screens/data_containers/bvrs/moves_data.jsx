// @flow

import {
  type GetBvrT,
  behaviour_impl,
  createPatch,
  data,
} from "screens/data_containers/utils";
import {
  Filtering,
  type FilteringT,
} from "screens/data_containers/bvrs/filtering";
import { Selection } from "screens/data_containers/bvrs/selection";
import { computed, observable } from "utils/mobx_wrapper";
import type { UserProfileT } from "profiles/types";
import type { MoveT } from "moves/types";
import type { UUID } from "kernel/types";
import type { MoveListT } from "move_lists/types";
import { listToItemById } from "utils/utils";

// $FlowFixMe
@behaviour_impl
export class MovesData {
  @observable moves: Array<MoveT> = [];
  // $FlowFixMe
  @computed get moveIds(): Array<UUID> {
    return Object.keys(this.moveById);
  }
  // $FlowFixMe
  @computed get moveById(): { [UUID]: MoveT } {
    return listToItemById(this.preview);
  }
  @observable _userProfile: ?UserProfileT;
  @observable _moveList: ?MoveListT;
  @observable _moveLists: Array<MoveListT> = [];

  @observable preview: Array<MoveT> = [];
  @data display: Array<MoveT> = [];

  static get: GetBvrT<MovesData>;
}

export function createMovesData() {
  return new MovesData();
}

export const filteredItemsAreDisplayed = createPatch(
  MovesData,
  [Filtering],
  (filtering: FilteringT) => ({
    get display() {
      return filtering.filteredItems;
    },
  })
);

export const displayedItemsCanBeSelected = createPatch(
  Selection,
  [MovesData],
  (data: MovesData) => ({
    get selectableIds() {
      return data.display.map(x => x.id);
    },
  })
);
