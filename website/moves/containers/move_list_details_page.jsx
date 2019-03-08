// @flow

import * as appActions from 'app/actions'
import * as movesActions from 'moves/actions'
import * as React from 'react'
import { connect } from 'react-redux'
import * as fromStore from 'moves/reducers'
import * as fromAppStore from 'app/reducers'
import { MoveListDetails } from 'moves/presentation/move_list_details'
import { MoveListForm } from 'moves/presentation/move_list_form'
import { browseToMove } from 'moves/containers/move_list_frame'
import { isOwner, createErrorHandler } from 'app/utils'
import { findMoveListByUrl, newMoveListSlug } from 'moves/utils'
import {
  useInsertMoveList, useNewMoveList, useSaveMoveList
} from 'moves/containers/move_list_crud_behaviours'
import type { UUID, UserProfileT, TagT } from 'app/types';
import type { MoveListT, MoveListCrudBvrsT } from 'moves/types'
import type {
  InsertMoveListBvrT, NewMoveListBvrT, SaveMoveListBvrT
} from 'moves/containers/move_list_crud_behaviours'


function _setSelectedMoveListByUrl(moveLists: Array<MoveListT>, moveListUrl: string) {
  const moveList = (
    findMoveListByUrl(moveLists, moveListUrl) ||
    moveLists.find(x => true)
  );

  if (moveList) {
    const updateProfile = moveList.slug != newMoveListSlug;
    browseToMove([moveListUrl], updateProfile);
  }
}


export type MoveListDetailsPagePropsT = {
  userProfile: UserProfileT,
  moveLists: Array<MoveListT>,
  moveListTags: Array<TagT>,
  selectedMoveListUrl: string,
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
  moveList: MoveListT, props: MoveListDetailsPagePropsT, bvrs: MoveListCrudBvrsT) {

  const editBtn =
    <div
      className={"button button--wide ml-2"}
      onClick={() => bvrs.setIsEditing(true)}
      key={1}
    >
    Edit
    </div>;

  const div = bvrs.isEditing
    ? <MoveListForm
      autoFocus={true}
      knownTags={props.moveListTags}
      moveList={moveList}
      onSubmit={bvrs.saveMoveListBvr.saveItem}
      onCancel={bvrs.saveMoveListBvr.discardChanges}
      />
    : _createStaticMoveListDetails(moveList, props);

  return (
    <div>
      {editBtn}
      {div}
    </div>
  );
}


export function MoveListDetailsPage(props: MoveListDetailsPagePropsT) {
  const actions: any = props;

  const [isEditing, setIsEditing] = React.useState(false);

  const insertMoveListBvr: InsertMoveListBvrT = useInsertMoveList(
    props.moveLists,
    actions.actInsertMoveLists,
    createErrorHandler
  );

  const [nextSelectedMoveListId, setNextSelectedMoveListId] = React.useState(null);
  React.useEffect(
    () => {
      if (nextSelectedMoveListId != null) {
        _setSelectedMoveListByUrl(
          insertMoveListBvr.preview, nextSelectedMoveListId
        );
      }
    },
    [nextSelectedMoveListId]
  )

  const selectedMoveListInStore = findMoveListByUrl(
    props.moveLists, props.selectedMoveListUrl
  );

  const newMoveListBvr: NewMoveListBvrT = useNewMoveList(
    props.userProfile,
    setNextSelectedMoveListId,
    selectedMoveListInStore ? selectedMoveListInStore.id : "",
    insertMoveListBvr,
    setIsEditing,
  );

  const saveMoveListBvr: SaveMoveListBvrT = useSaveMoveList(
    insertMoveListBvr.preview,
    newMoveListBvr,
    setIsEditing,
    actions.actInsertMoveLists,
    createErrorHandler
  );

  const bvrs: MoveListCrudBvrsT = {
    isEditing,
    setIsEditing,
    insertMoveListBvr,
    newMoveListBvr,
    saveMoveListBvr
  };

  const moveList = findMoveListByUrl(
    bvrs.insertMoveListBvr.preview,
    props.selectedMoveListUrl
  );

  if (!moveList) {
    return <React.Fragment/>;
  }

  return isOwner(props.userProfile, moveList.ownerId)
    ? _createOwnMoveListDetails(moveList, props, bvrs)
    : _createStaticMoveListDetails(moveList, props)
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
