import classnames from 'classnames';

import { VoteT } from 'src/votes/types';

import './VoteCount.scss';

export function VoteCount({
  vote,
  count,
  setVote,
}: {
  vote: VoteT;
  count: number;
  setVote: (vote: VoteT) => void;
}) {
  function _toggleUpVote() {
    setVote(vote === 1 ? 0 : 1);
  }

  function _toggleDownVote() {
    setVote(vote === -1 ? 0 : -1);
  }

  const voteCount = (
    <div
      className={classnames('voteCount', {
        'voteCount--voted': vote !== 0,
        'voteCount--notVoted': vote === 0,
      })}
    >
      {count}
    </div>
  );

  const upVote = (
    <div
      className={classnames('upVoteBtn', {
        'upVoteBtn--voted': vote === 1,
        'upVoteBtn--notVoted': vote !== 1,
      })}
      onClick={_toggleUpVote}
    />
  );

  const downVote = (
    <div
      className={classnames('downVoteBtn', {
        'downVoteBtn--voted': vote === -1,
        'downVoteBtn--notVoted': vote !== -1,
      })}
      onClick={_toggleDownVote}
    />
  );

  return (
    <div className="voteCountPanel">
      {voteCount}
      {upVote}
      {downVote}
    </div>
  );
}
