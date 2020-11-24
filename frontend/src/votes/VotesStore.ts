import { VoteByIdT, VoteT } from 'src/votes/types';
import { observable } from 'src/utils/mobx_wrapper';
import { operation, data } from 'facility';
import { UUID } from 'src/kernel/types';

export class VotesStore {
  @observable @data voteByObjectId: VoteByIdT = {};

  @operation setVotes(voteByObjectId: VoteByIdT) {
    this.voteByObjectId = voteByObjectId;
  }

  @operation castVote(id: UUID, vote: VoteT) {
    this.voteByObjectId = {
      ...this.voteByObjectId,
      [id]: vote,
    };
  }
}
