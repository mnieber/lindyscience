// @flow

import * as React from "react";
import classnames from "classnames";
import type { VoteT } from "app/types";

// VoteCount

export function StaticVoteCount({
  vote,
  count,
}: {
  vote: VoteT,
  count: number,
}) {
  const voteCount = (
    <div
      className={classnames("voteCount", {
        "voteCount--voted": vote != 0,
        "voteCount--notVoted": vote == 0,
      })}
    >
      {count}
    </div>
  );

  return <div className="voteCountPanel">{voteCount}</div>;
}
