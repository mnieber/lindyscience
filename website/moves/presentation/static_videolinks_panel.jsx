// @flow

import * as React from 'react'
import { StaticVideoLinkList } from 'moves/presentation/static_videolink';
import type { UUID, VoteT, VoteByIdT, UserProfileT } from 'app/types';
import type { MoveT, VideoLinkT } from 'moves/types'


type StaticVideoLinksPanelPropsT = {
  videoLinks: Array<VideoLinkT>,
  voteByObjectId: VoteByIdT,
};

export function StaticVideoLinksPanel(props: StaticVideoLinksPanelPropsT) {
  return (
    <div className={"videoLinksPanel panel"}>
      <StaticVideoLinkList
        items={props.videoLinks}
        voteByObjectId={props.voteByObjectId}
      />
    </div>
  );
};
