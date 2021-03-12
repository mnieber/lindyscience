import { VoteByIdT, VoteT } from 'src/votes/types';
import { makeObservable, action, observable } from 'mobx';
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
  @observable voteByObjectId: VoteByIdT = {};

  constructor() {
    makeObservable(this);
  }

  @host setVotes(voteByObjectId: VoteByIdT) {
    return action((cbs: VotesStore_setVotes) => {
      this.voteByObjectId = voteByObjectId;
    });
  }

  @host castVote(id: UUID, vote: VoteT) {
    return action((cbs: VotesStore_castVote) => {
      this.voteByObjectId = {
        ...this.voteByObjectId,
        [id]: vote,
      };
    });
  }
}
