// @flow

import * as React from 'react'
import MovesCtr from 'moves/containers/index'
import AppCtr from 'app/containers/index'

import Widgets from 'moves/presentation/index'
import { isOwner } from 'app/utils'
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
    <Widgets.MoveListDetails
      userProfile={props.userProfile}
      moveList={moveList}
    >
    </Widgets.MoveListDetails>
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
    ? <Widgets.MoveListForm
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
    props.moveListCrudBvrs.insertMoveListsBvr.preview,
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
MoveListDetailsPage = MovesCtr.connect(
  (state) => ({
    userProfile: AppCtr.fromStore.getUserProfile(state.app),
    moveLists: MovesCtr.fromStore.getMoveLists(state.moves),
    selectedMoveListUrl: MovesCtr.fromStore.getSelectedMoveListUrl(state.moves),
    moveListTags: MovesCtr.fromStore.getMoveListTags(state.moves),
  }),
  {
    ...AppCtr.actions,
    ...MovesCtr.actions,
  }
)(MoveListDetailsPage)

export default MoveListDetailsPage;
