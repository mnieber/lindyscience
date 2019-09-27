// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import type { UUID } from "kernel/types";
import type { TagT } from "tags/types";
import type {
  SaveMoveBvrT,
  NewMoveBvrT,
} from "screens/bvrs/move_crud_behaviours";
import type {
  SaveMoveListBvrT,
  NewMoveListBvrT,
} from "screens/bvrs/move_list_crud_behaviours";

export type MoveSearchResultT = {
  id: UUID,
  name: string,
  slug: string,
  sourceMoveList: any,
};

export type FunctionByIdT = {
  [UUID]: Function,
};

export type VotableT = {};

export type MoveCrudBvrsT = {
  newMoveBvr: NewMoveBvrT,
  saveMoveBvr: SaveMoveBvrT,
  isEditing: boolean,
  setIsEditing: boolean => void,
  setHighlightedMoveId: UUID => void,
};

export type MoveListCrudBvrsT = {
  newMoveListBvr: NewMoveListBvrT,
  saveMoveListBvr: SaveMoveListBvrT,
  isEditing: boolean,
  setIsEditing: boolean => void,
  setHighlightedMoveListId: UUID => void,
};
