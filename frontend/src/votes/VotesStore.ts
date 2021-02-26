import { VoteByIdT, VoteT } from 'src/votes/types';
import { observable } from 'src/utils/mobx_wrapper';
import { operation, data } from 'facility';
import { UUID } from 'src/kernel/types';
import { host, stub } from 'aspiration';

export class VotesStore_setVotes {
  voteByObjectId: VoteByIdT = stub();
}

export class VotesStore_castVote {
  id: UUID = stub();
  vote: VoteT = stub();
}

export class VotesStore {
  @observable @data voteByObjectId: VoteByIdT = {};

  @operation @host setVotes(voteByObjectId: VoteByIdT) {
    return (cbs: VotesStore_setVotes) => {
      this.voteByObjectId = voteByObjectId;
    };
  }

  @operation @host castVote(id: UUID, vote: VoteT) {
    return (cbs: VotesStore_castVote) => {
      this.voteByObjectId = {
        ...this.voteByObjectId,
        [id]: vote,
      };
    };
  }
}
