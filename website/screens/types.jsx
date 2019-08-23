// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import type { UUID } from "app/types";
import type { TagT } from "profiles/types";
import type {
  SaveMoveBvrT,
  InsertMovesBvrT,
  NewMoveBvrT,
} from "screens/containers/move_crud_behaviours";
import type {
  SaveMoveListBvrT,
  InsertMoveListsBvrT,
  NewMoveListBvrT,
} from "screens/containers/move_list_crud_behaviours";

export type MoveSearchResultT = {
  id: UUID,
  name: string,
  slug: string,
  sourceMoveList: any,
};

export type MoveListT = {
  id: UUID,
  name: string,
  slug: string,
  description: string,
  isPrivate: boolean,
  role: string,
  tags: Array<TagT>,
  moves: Array<UUID>,
  ownerId: number,
  ownerUsername: string,
};

export type MoveListByIdT = {
  [UUID]: MoveListT,
};

export type FunctionByIdT = {
  [UUID]: Function,
};

export type VotableT = {};

export type VideoLinkT = {
  id: UUID,
  moveId: UUID,
  ownerId: number,
  title: string,
  url: string,
  initialVoteCount: number,
  voteCount: number,
};

export type TipT = {|
  id: UUID,
  moveId: UUID,
  text: string,
  ownerId: number,
  initialVoteCount: number,
  voteCount: number,
|};

export type TipByIdT = {
  [UUID]: TipT,
};

export type TipsByIdT = {
  [UUID]: Array<TipT>,
};

export type VideoLinkByIdT = {
  [UUID]: VideoLinkT,
};

export type VideoLinksByIdT = {
  [UUID]: Array<VideoLinkT>,
};

export type MovePrivateDataT = {
  notes: string,
  tags: Array<TagT>,
};

export type MovePrivateDataByIdT = { [UUID]: MovePrivateDataT };

export type MoveCrudBvrsT = {
  newMoveBvr: NewMoveBvrT,
  insertMovesBvr: InsertMovesBvrT,
  saveMoveBvr: SaveMoveBvrT,
  isEditing: boolean,
  setIsEditing: boolean => void,
};

export type MoveListCrudBvrsT = {
  newMoveListBvr: NewMoveListBvrT,
  insertMoveListsBvr: InsertMoveListsBvrT,
  saveMoveListBvr: SaveMoveListBvrT,
  isEditing: boolean,
  setIsEditing: boolean => void,
};
