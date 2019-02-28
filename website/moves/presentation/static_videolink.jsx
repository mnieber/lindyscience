// @flow

import * as React from 'react'
import { StaticVoteCount } from 'app/presentation/static_vote_count'
import { VideoLinkForm } from 'moves/presentation/video_link_form'
import { useFlag } from 'utils/hooks'
import type { VoteByIdT, VoteT } from 'app/types'
import type { VideoLinkT } from 'moves/types'


// VideoLinkeoLink

type StaticVideoLinkPropsT = {
  item: VideoLinkT,
  vote: VoteT,
};

export function StaticVideoLink(props: StaticVideoLinkPropsT) {
  const voteCount = (
    <StaticVoteCount
      vote={props.vote}
      count={props.item.voteCount}
    />
  )

  const link = (
    <a
      className='videoLink__url'
      href={props.item.url}
      target='blank'
    >
      {props.item.title || props.item.url}
    </a>
  );

  return (
    <div className='videoLink'>
      {voteCount}
      {link}
    </div>
  );
}

// StaticVideoLinkList

type StaticVideoLinkListPropsT = {
  items: Array<VideoLinkT>,
  voteByObjectId: VoteByIdT,
};

export function StaticVideoLinkList(props: StaticVideoLinkListPropsT) {
  const itemNodes = props.items.map<React.Node>((item, idx) => {
    return (
      <StaticVideoLink
        key={item.id}
        item={item}
        vote={props.voteByObjectId[item.id] || 0}
      />
    );
  })

  return itemNodes;
}
