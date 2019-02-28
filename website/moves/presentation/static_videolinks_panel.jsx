// @flow

import * as React from 'react'
import type { UUID, VoteT, VoteByIdT, UserProfileT } from 'app/types';
import type { MoveT, VideoLinkT } from 'moves/types'
// $FlowFixMe
import { StaticVideoLinkList } from 'moves/presentation/static_videolink';


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
