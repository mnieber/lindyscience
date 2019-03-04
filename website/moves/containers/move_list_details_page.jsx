// @flow

import * as appActions from 'app/actions'
import * as movesActions from 'moves/actions'
import * as React from 'react'
import { connect } from 'react-redux'
import * as fromStore from 'moves/reducers'
import * as fromAppStore from 'app/reducers'
import { MoveListDetails } from 'moves/presentation/move_list_details'
import type { UUID, UserProfileT } from 'app/types';
import type { MoveListT } from 'moves/types'


export type MoveListDetailsPagePropsT = {
  userProfile: UserProfileT,
  moveList: MoveListT,
  // receive any actions as well
};

export function MoveListDetailsPage(props: MoveListDetailsPagePropsT) {
  const actions: any = props;

  if (!props.moveList) {
    return <React.Fragment/>;
  }
  return (
    <MoveListDetails
      userProfile={props.userProfile}
      moveList={props.moveList}
    >
    </MoveListDetails>
  );
}

// $FlowFixMe
MoveListDetailsPage = connect(
  (state) => ({
    userProfile: fromAppStore.getUserProfile(state.app),
    moveList: fromStore.getSelectedMoveList(state.moves),
  }),
  {
    ...appActions,
    ...movesActions,
  }
)(MoveListDetailsPage)

export default MoveListDetailsPage;
