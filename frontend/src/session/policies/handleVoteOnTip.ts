import { createErrorHandler } from 'src/app/utils';
import { SessionContainer } from 'src/session/SessionCtr';
import { UUID } from 'src/kernel/types';
import { VoteT } from 'src/votes/types';
import { apiVoteTip } from 'src/votes/api';
import { listen } from 'facet';

export const handleVoteOnTip = (ctr: SessionContainer) => {
  const votesStore = ctr.votesStore;
  const tipsStore = ctr.tipsStore;

  listen(
    votesStore,
    'castVote',
    function (id: UUID, vote: VoteT) {
      if (tipsStore.tipById[id] !== undefined) {
        apiVoteTip(id, vote).catch(
          createErrorHandler('We could not save your vote')
        );
        const prevVote = votesStore.voteByObjectId[id] ?? 0;
        tipsStore.castVote(id, vote, prevVote);
      }
    },
    { after: false }
  );
};
