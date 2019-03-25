// @flow

import * as React from "react";
import { StaticVideoLinkList } from "moves/presentation/static_videolink";
import type { VoteByIdT } from "app/types";
import type { VideoLinkT } from "moves/types";

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
