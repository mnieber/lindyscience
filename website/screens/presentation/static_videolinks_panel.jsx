// @flow

import * as React from "react";
import { StaticVideoLinkList } from "screens/presentation/static_videolink";
import type { VoteByIdT } from "votes/types";
import type { VideoLinkT } from "screens/types";

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
}
