// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import type { UUID } from "kernel/types";
import type { TagT } from "tags/types";
import type { EditMoveBvrT } from "screens/bvrs/move_crud_behaviours";
import type { EditMoveListBvrT } from "screens/bvrs/move_list_crud_behaviours";

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
  editMoveBvr: EditMoveBvrT,
  isEditing: boolean,
  setIsEditing: boolean => void,
  setHighlightedMoveId: UUID => void,
};

export type MoveListCrudBvrsT = {
  editMoveListBvr: EditMoveListBvrT,
  isEditing: boolean,
  setIsEditing: boolean => void,
  setHighlightedMoveListId: UUID => void,
};
