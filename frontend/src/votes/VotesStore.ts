import { VoteByIdT, VoteT } from 'src/votes/types';
import { action, observable } from 'src/utils/mobx_wrapper';
import { UUID } from 'src/kernel/types';

export class VotesStore {
  @observable voteByObjectId: VoteByIdT = {};

  @action setVotes(voteByObjectId: VoteByIdT) {
    this.voteByObjectId = voteByObjectId;
  }

  @action castVote(id: UUID, vote: VoteT) {
    this.voteByObjectId = {
      ...this.voteByObjectId,
      [id]: vote,
    };
  }
}
