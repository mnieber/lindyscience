// @flow

import React from 'react'
import { AccountMenu } from 'app/presentation/accountmenu';
import { navigate } from "@reach/router"

import MoveContainer from 'moves/containers/index'
import AppCtr from 'app/containers/index'

import { getObjectValues } from 'utils/utils'
import { createToastr, createErrorHandler } from 'app/utils'
import { findMoveListByUrl, newMoveListSlug } from 'moves/utils'

import {
  useInsertMoveList, useNewMoveList, useSaveMoveList, MoveListCrudBvrsContext
} from 'moves/containers/move_list_crud_behaviours'

import type { UUID, UserProfileT } from 'app/types';
import type { MoveListT, MoveListCrudBvrsT } from 'moves/types';
import type {
  InsertMoveListBvrT, NewMoveListBvrT, SaveMoveListBvrT
} from 'moves/containers/move_list_crud_behaviours'


export function browseToMove(moveUrlParts: Array<string>, mustUpdateProfile: boolean=true) {
  const moveUrl = moveUrlParts.filter(x => !!x).join('/');
  navigate(`/app/list/${moveUrl}`);
  if (mustUpdateProfile) {
    AppCtr.api.updateProfile(moveUrl);
  }
}


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


function _createMoveListCrudBvrs(
  props: AppFramePropsT,
  setNextSelectedMoveListId: Function,
): MoveListCrudBvrsT {
  const actions: any = props;
  const [isEditing, setIsEditing] = React.useState(false);

  const moveList = findMoveListByUrl(props.moveLists, props.selectedMoveListUrl);

  const insertMoveListBvr: InsertMoveListBvrT = useInsertMoveList(
    props.moveLists,
    actions.actInsertMoveLists,
    createErrorHandler
  );

  const newMoveListBvr: NewMoveListBvrT = useNewMoveList(
    props.userProfile,
    setNextSelectedMoveListId,
    moveList ? moveList.id : "",
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

  return bvrs;
}


// AppFrame
type AppFramePropsT = {
  moveLists: Array<MoveListT>,
  selectedMoveListUrl: string,
  userProfile: ?UserProfileT,
  signedInEmail: string,
  children: any,
  // also receive any actions
};

function AppFrame(props: AppFramePropsT) {
  const actions: any = props;

  const [hasLoadedMoveLists, setHasLoadedMoveLists] = React.useState(null);
  const [loadedEmail, setLoadedEmail] = React.useState("");
  const [loadedMoveListUrl, setLoadedMoveListUrl] = React.useState("");

  async function _loadMoveListsAndEmail() {
    if (hasLoadedMoveLists === null) {
      setHasLoadedMoveLists(false);

      const [email, moveLists] = await Promise.all([
        AppCtr.api.getEmail(),
        MoveContainer.api.loadMoveLists(),
      ]);
      if (email) {
        actions.actSetSignedInEmail(email);
      }
      actions.actInsertMoveLists(moveLists.entities.moveLists || {}, "");
      setHasLoadedMoveLists(true);
    }
  }

  async function _loadUserProfile() {
    if (hasLoadedMoveLists && loadedEmail != props.signedInEmail) {
      const [profile, votes, movePrivateDatas] = await Promise.all([
        AppCtr.api.loadUserProfile(),
        AppCtr.api.loadUserVotes(),
        MoveContainer.api.loadMovePrivateDatas()
      ]);
      actions.actSetUserProfile(profile);
      actions.actSetVotes(votes);
      actions.actAddMovePrivateDatas(movePrivateDatas.entities.movePrivateDatas || {});

      setLoadedEmail(props.signedInEmail);
    }
  }

  async function _loadSelectedMoveList() {
    if (hasLoadedMoveLists && loadedMoveListUrl != props.selectedMoveListUrl) {
      const [moveList] = await Promise.all([
        MoveContainer.api.loadMoveList(
          findMoveListByUrl(props.moveLists, props.selectedMoveListUrl).id
        )
      ]);
      actions.actAddMoves(getObjectValues(moveList.entities.moves || {}));
      actions.actInsertMoveLists(moveList.entities.moveLists, "");
      actions.actAddVideoLinks(moveList.entities.videoLinks || {});
      actions.actAddTips(moveList.entities.tips || {});
      setLoadedMoveListUrl(props.selectedMoveListUrl);
    }
  }

  React.useEffect(() => {_loadMoveListsAndEmail()});
  React.useEffect(() => {_loadUserProfile()}, [hasLoadedMoveLists, props.signedInEmail]);
  React.useEffect(() => {_loadSelectedMoveList()}, [hasLoadedMoveLists, props.selectedMoveListUrl]);

  const [nextSelectedMoveListId, setNextSelectedMoveListId] = React.useState(null);
  const moveListCrudBvrs = _createMoveListCrudBvrs(props, setNextSelectedMoveListId);
  React.useEffect(
    () => {
      if (nextSelectedMoveListId != null) {
        _setSelectedMoveListByUrl(
          moveListCrudBvrs.insertMoveListBvr.preview, nextSelectedMoveListId
        );
      }
    },
    [nextSelectedMoveListId]
  )

  function signIn() {
    navigate("/app/sign-in/");
  }

  return (
    <div className="appFrame px-4 flex flex-col">
      {createToastr()}
      <div className="flex flex-row justify-between h-16">
        <h1 onClick={() => alert("TODO")}>Lindy Science</h1>
        <AccountMenu
          className=""
          userProfile={props.userProfile}
          signIn={signIn}
        />
      </div>
      <React.Fragment>
        <MoveListCrudBvrsContext.Provider value={moveListCrudBvrs}>
          {props.children}
        </MoveListCrudBvrsContext.Provider>
      </React.Fragment>
    </div>
  );
};

// $FlowFixMe
AppFrame = MoveContainer.connect(
  (state) => ({
    moveLists: MoveContainer.fromStore.getMoveLists(state.moves),
    userProfile: AppCtr.fromStore.getUserProfile(state.app),
    signedInEmail: AppCtr.fromStore.getSignedInEmail(state.app),
    selectedMoveListUrl: MoveContainer.fromStore.getSelectedMoveListUrl(state.moves),
  }),
  {
    ...MoveContainer.actions,
    ...AppCtr.actions,
  }
)(AppFrame)

export default AppFrame;
