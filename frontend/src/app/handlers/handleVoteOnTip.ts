import { VotesStore } from 'src/votes/VotesStore';
import { TipsStore } from 'src/tips/TipsStore';
import { createErrorHandler } from 'src/app/utils';
import { UUID } from 'src/kernel/types';
import { VoteT } from 'src/votes/types';
import { apiVoteTip } from 'src/votes/api';

export function handleVoteOnTip(
  votesStore: VotesStore,
  tipsStore: TipsStore,
  id: UUID,
  vote: VoteT
) {
  if (tipsStore.tipById[id] !== undefined) {
    apiVoteTip(id, vote).catch(
      createErrorHandler('We could not save your vote')
    );
    const prevVote = votesStore.voteByObjectId[id] ?? 0;
    tipsStore.castVote(id, vote, prevVote);
  }
}
