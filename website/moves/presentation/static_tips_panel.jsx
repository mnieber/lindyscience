// @flow

import * as actions from 'moves/actions'
import * as React from 'react'
import type { UUID, VoteT, VoteByIdT, UserProfileT } from 'app/types';
import type { MoveT, TipT } from 'moves/types'
// $FlowFixMe
import uuidv4 from 'uuid/v4'
import { connect } from 'react-redux'
import { createErrorHandler, querySetListToDict, slugify, isNone } from 'utils/utils'
import { StaticTipList } from 'moves/presentation/static_tip';
import { useFlag } from 'utils/hooks'


type StaticTipsPanelPropsT = {
  tips: Array<TipT>,
  voteByObjectId: VoteByIdT,
};

export function StaticTipsPanel(props: StaticTipsPanelPropsT) {
  return (
    <div className={"tipsPanel panel"}>
      <StaticTipList
        items={props.tips}
        voteByObjectId={props.voteByObjectId}
      />
    </div>
  );
};