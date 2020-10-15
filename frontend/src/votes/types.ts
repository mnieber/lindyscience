///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

export type VoteT = -1 | 0 | 1;

export type VoteByIdT = {
  [id: string]: VoteT;
};