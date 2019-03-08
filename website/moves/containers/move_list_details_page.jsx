// @flow

import * as appActions from 'app/actions'
import * as movesActions from 'moves/actions'
import * as React from 'react'
import { connect } from 'react-redux'
import * as fromStore from 'moves/reducers'
import * as fromAppStore from 'app/reducers'
import { MoveListDetails } from 'moves/presentation/move_list_details'
import { MoveListForm } from 'moves/presentation/move_list_form'
import { isOwner, createErrorHandler } from 'app/utils'
import { findMoveListByUrl } from 'moves/utils'
import { MoveListCrudBvrsContext } from 'moves/containers/move_list_crud_behaviours'
import type { UUID, UserProfileT, TagT } from 'app/types';
import type { MoveListT, MoveListCrudBvrsT } from 'moves/types'


type MoveListDetailsPagePropsT = {
  userProfile: UserProfileT,
  moveLists: Array<MoveListT>,
  moveListTags: Array<TagT>,
  selectedMoveListUrl: string,
  // receive any actions as well
};

type _MoveListDetailsPagePropsT = MoveListDetailsPagePropsT & {
  moveListCrudBvrs: MoveListCrudBvrsT
};

function _createStaticMoveListDetails(
  moveList: MoveListT, props: _MoveListDetailsPagePropsT
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
  moveList: MoveListT, props: _MoveListDetailsPagePropsT) {

  const editBtn =
    <div
      className={"button button--wide ml-2"}
      onClick={() => props.moveListCrudBvrs.setIsEditing(true)}
      key={1}
    >
    Edit
    </div>;

  const div = props.moveListCrudBvrs.isEditing
    ? <MoveListForm
      autoFocus={true}
      knownTags={props.moveListTags}
      moveList={moveList}
      onSubmit={props.moveListCrudBvrs.saveMoveListBvr.saveItem}
      onCancel={props.moveListCrudBvrs.saveMoveListBvr.discardChanges}
      />
    : _createStaticMoveListDetails(moveList, props);

  return (
    <div>
      {editBtn}
      {div}
    </div>
  );
}


export function _MoveListDetailsPage(props: _MoveListDetailsPagePropsT) {
  const actions: any = props;

  const moveList = findMoveListByUrl(
    props.moveListCrudBvrs.insertMoveListBvr.preview,
    props.selectedMoveListUrl
  );

  if (!moveList) {
    return <React.Fragment/>;
  }

  return isOwner(props.userProfile, moveList.ownerId)
    ? _createOwnMoveListDetails(moveList, props)
    : _createStaticMoveListDetails(moveList, props)
}

export function MoveListDetailsPage(props: MoveListDetailsPagePropsT) {
  return (
    <MoveListCrudBvrsContext.Consumer>{moveListCrudBvrs =>
      <_MoveListDetailsPage
        {...props}
        moveListCrudBvrs={moveListCrudBvrs}
      />
    }</MoveListCrudBvrsContext.Consumer>
  );
}

// $FlowFixMe
MoveListDetailsPage = connect(
  (state) => ({
    userProfile: fromAppStore.getUserProfile(state.app),
    moveLists: fromStore.getMoveLists(state.moves),
    selectedMoveListUrl: fromStore.getSelectedMoveListUrl(state.moves),
    moveListTags: fromStore.getMoveListTags(state.moves),
  }),
  {
    ...appActions,
    ...movesActions,
  }
)(MoveListDetailsPage)

export default MoveListDetailsPage;
