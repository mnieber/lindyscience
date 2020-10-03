import { action, observable } from 'src/utils/mobx_wrapper';
import { VoteByIdT } from 'src/votes/types';
import { UUID } from 'src/kernel/types';

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
