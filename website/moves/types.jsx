// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import type { UUID, TagT } from 'app/types';
import type {
  SaveMoveBvrT, InsertMovesBvrT, NewMoveBvrT
} from 'moves/containers/move_crud_behaviours'
import type {
  SaveMoveListBvrT, InsertMoveListsBvrT, NewMoveListBvrT
} from 'moves/containers/move_list_crud_behaviours'

export type MoveT = {
  id: UUID,
  description: string,
  tags: Array<TagT>,
  videoLinks: Array<UUID>,
  tips: Array<UUID>,
  name: string,
  slug: string,
  ownerId: number,
  privateData: ?MovePrivateDataT
};

export type MoveListT = {
  id: UUID,
  name: string,
  slug: string,
  description: string,
  tags: Array<TagT>,
  moves: Array<UUID>,
  ownerId: number,
  ownerUsername: string,
};

export type MoveListByIdT = {
  [UUID]: MoveListT
};

export type VotableT = {
};

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
  [UUID]: TipT
};

export type TipsByIdT = {
  [UUID]: Array<TipT>
};

export type MoveByIdT = {
  [UUID]: MoveT
};

export type MoveBySlugT = {
  [string]: MoveT
};

export type VideoLinkByIdT = {
  [UUID]: VideoLinkT
};

export type VideoLinksByIdT = {
  [UUID]: Array<VideoLinkT>
};

export type MovePrivateDataT = {
  notes: string,
};

export type MovePrivateDataByIdT = {[UUID]: MovePrivateDataT};

export type MoveCrudBvrsT = {
  newMoveBvr: NewMoveBvrT,
  insertMovesBvr: InsertMovesBvrT,
  saveMoveBvr: SaveMoveBvrT,
  isEditing: boolean,
  setIsEditing: (boolean) => void,
};

export type MoveListCrudBvrsT = {
  newMoveListBvr: NewMoveListBvrT,
  insertMoveListsBvr: InsertMoveListsBvrT,
  saveMoveListBvr: SaveMoveListBvrT,
  isEditing: boolean,
  setIsEditing: (boolean) => void,
};
