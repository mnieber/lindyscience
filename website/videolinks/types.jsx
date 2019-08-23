// @flow

///////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////

import type { UUID } from "kernel/types";

export type VideoLinkT = {
  id: UUID,
  moveId: UUID,
  ownerId: number,
  title: string,
  url: string,
  initialVoteCount: number,
  voteCount: number,
};

export type VideoLinkByIdT = {
  [UUID]: VideoLinkT,
};

export type VideoLinksByIdT = {
  [UUID]: Array<VideoLinkT>,
};
