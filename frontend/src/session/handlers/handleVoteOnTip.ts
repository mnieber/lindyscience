import { VotesStore } from 'src/votes/VotesStore';
import { createErrorHandler } from 'src/app/utils';
import { SessionContainer } from 'src/session/SessionCtr';
import { UUID } from 'src/kernel/types';
import { VoteT } from 'src/votes/types';
import { apiVoteTip } from 'src/votes/api';
import { getCtr } from 'facility';

export function handleVoteOnTip(facet: VotesStore, id: UUID, vote: VoteT) {
  const ctr = getCtr<SessionContainer>(facet);
  const tipsStore = ctr.tipsStore;

  if (tipsStore.tipById[id] !== undefined) {
    apiVoteTip(id, vote).catch(
      createErrorHandler('We could not save your vote')
    );
    const prevVote = facet.voteByObjectId[id] ?? 0;
    tipsStore.castVote(id, vote, prevVote);
  }
}
