// @flow

import type { VoteByIdT } from 'src/votes/types';
import { action, observable } from 'src/utils/mobx_wrapper';
import type { UUID } from 'src/kernel/types';

export class VotesStore {
  @observable voteByObjectId: VoteByIdT = {};

  @action setVotes(voteByObjectId: VoteByIdT) {
    this.voteByObjectId = voteByObjectId;
  }

  @action castVote(id: UUID, vote: number) {
    this.voteByObjectId = {
      ...this.voteByObjectId,
      [id]: vote,
    };
  }
}
