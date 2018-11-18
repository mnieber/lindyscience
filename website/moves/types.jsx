// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import type { UUID } from 'app/types';

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
  owner: number,
};

export type MoveListT = {
  id: UUID,
  tags: Array<TagT>,
  moves: Array<UUID>,
  name: string,
  slug: string,
  owner: number,
};

export type MoveListByIdT = {
  [UUID]: MoveListT
};

export type VotableT = {
};

export type VideoLinkT = {
  id: UUID,
  moveId: UUID,
  owner: number,
  title: string,
  url: string,
  initialVoteCount: number,
  voteCount: number,
};

export type TipT = {|
  id: UUID,
  moveId: UUID,
  text: string,
  owner: number,
  initialVoteCount: number,
  voteCount: number,
|};

export type VoteT = -1 | 0 | 1;

export type VoteByIdT = {
  [UUID]: VoteT
};

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
