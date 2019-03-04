// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import type { UUID } from 'app/types';
import type { SaveMoveBvrT, InsertMoveBvrT, NewMoveBvrT } from 'moves/containers/move_crud_behaviours'
import type { FlagT } from 'utils/hooks'

export type DifficultyT = '' | 'beg' | 'beg/int' | 'int' | 'int/adv' | 'adv';

export type MoveT = {
  id: UUID,
  difficulty: DifficultyT,
  description: string,
  tags: Array<TagT>,
  videoLinks: Array<UUID>,
  tips: Array<UUID>,
  name: string,
  slug: string,
  ownerId: number,
};

export type MoveListT = {
  id: UUID,
  tags: Array<TagT>,
  moves: Array<UUID>,
  name: string,
  slug: string,
  description: string,
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

export type TagT = string;

export type TagMapT = {
  [TagT]: boolean
};

export type MovePrivateDataByIdT = {[UUID]: {}};

export type MoveCrudBvrsT = {
  newMoveBvr: NewMoveBvrT,
  insertMoveBvr: InsertMoveBvrT,
  saveMoveBvr: SaveMoveBvrT,
  isEditing: FlagT,
};
