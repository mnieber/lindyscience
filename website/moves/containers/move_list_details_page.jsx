// @flow

import * as appActions from 'app/actions'
import * as movesActions from 'moves/actions'
import * as React from 'react'
import { connect } from 'react-redux'
import * as fromStore from 'moves/reducers'
import * as fromAppStore from 'app/reducers'
import { MoveListDetails } from 'moves/presentation/move_list_details'
import { isOwner } from 'app/utils'
import type { UUID, UserProfileT } from 'app/types';
import type { MoveListT } from 'moves/types'


export type MoveListDetailsPagePropsT = {
  userProfile: UserProfileT,
  moveList: MoveListT,
  // receive any actions as well
};


function _createStaticMoveListDetails(
  moveList: MoveListT, props: MoveListDetailsPagePropsT
) {
  return (
    <MoveListDetails
      userProfile={props.userProfile}
      moveList={moveList}
    >
    </MoveListDetails>
  );
}


function _createOwnMoveListDetails(
  moveList: MoveListT, props: MoveListDetailsPagePropsT
) {
  return (
    <MoveListDetails
      userProfile={props.userProfile}
      moveList={moveList}
    >
    </MoveListDetails>
  );
}


export function MoveListDetailsPage(props: MoveListDetailsPagePropsT) {
  const actions: any = props;

  if (!props.moveList) {
    return <React.Fragment/>;
  }

  return isOwner(props.userProfile, props.moveList.ownerId)
    ? _createOwnMoveListDetails(props.moveList, props)
    : _createStaticMoveListDetails(props.moveList, props)
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
