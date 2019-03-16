// @flow

import * as React from "react";
import { StaticTipList } from "moves/presentation/static_tip";
import type { VoteByIdT } from "app/types";
import type { TipT } from "moves/types";

type StaticTipsPanelPropsT = {
  tips: Array<TipT>,
  voteByObjectId: VoteByIdT,
};

export function StaticTipsPanel(props: StaticTipsPanelPropsT) {
  return (
    <div className={"tipsPanel panel"}>
      <StaticTipList items={props.tips} voteByObjectId={props.voteByObjectId} />
    </div>
  );
}
