// @flow

import React from 'react'
import { AccountMenu } from 'app/presentation/accountmenu';
import { navigate } from "@reach/router"

import MoveContainer from 'moves/containers/index'
import AppCtr from 'app/containers/index'

import { getObjectValues, querySetListToDict } from 'utils/utils'
import { createToastr } from 'app/utils'
import { findMoveListByUrl, newMoveListSlug, makeMoveListUrl } from 'moves/utils'

import {
  MoveListCrudBvrsContext, createMoveListCrudBvrs
} from 'moves/containers/move_list_crud_behaviours'

import type { UUID, UserProfileT } from 'app/types';
import type { MoveListT } from 'moves/types';


export function browseToMove(moveUrlParts: Array<string>, mustUpdateProfile: boolean=true) {
  const moveUrl = moveUrlParts.filter(x => !!x).join('/');
  if (mustUpdateProfile) {
    AppCtr.api.updateProfile(moveUrl);
  }
  return navigate(`/app/list/${moveUrl}`);
}


function _setSelectedMoveListById(moveLists: Array<MoveListT>, id: UUID) {
  const moveList = (
    moveLists.find(x => x.id == id) ||
    moveLists.find(x => true)
  );

  if (moveList) {
    const updateProfile = moveList.slug != newMoveListSlug;
    browseToMove([makeMoveListUrl(moveList)], updateProfile);
  }
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
      actions.actAddMoveLists(moveLists.entities.moveLists || {});
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
      const moveListInStore = findMoveListByUrl(
        props.moveLists, props.selectedMoveListUrl
      );

      if (moveListInStore) {
        const [moveList] = await Promise.all([
          MoveContainer.api.loadMoveList(moveListInStore.id)
        ]);
        actions.actAddMoves(getObjectValues(moveList.entities.moves || {}));
        actions.actAddMoveLists(moveList.entities.moveLists);
        actions.actAddVideoLinks(moveList.entities.videoLinks || {});
        actions.actAddTips(moveList.entities.tips || {});
        setLoadedMoveListUrl(props.selectedMoveListUrl);
      }
    }
  }

  React.useEffect(() => {_loadMoveListsAndEmail()});
  React.useEffect(() => {_loadUserProfile()}, [hasLoadedMoveLists, props.signedInEmail]);
  React.useEffect(() => {_loadSelectedMoveList()}, [hasLoadedMoveLists, props.selectedMoveListUrl]);

  const [nextSelectedMoveListId, setNextSelectedMoveListId] = React.useState(null);
  React.useEffect(
    () => {
      if (nextSelectedMoveListId != null) {
        _setSelectedMoveListById(
          moveListCrudBvrs.insertMoveListBvr.preview, nextSelectedMoveListId
        );
      }
    },
    [nextSelectedMoveListId]
  )

  const moveListCrudBvrs = createMoveListCrudBvrs(
    props.moveLists,
    props.userProfile,
    props.selectedMoveListUrl,
    setNextSelectedMoveListId,
    _updateMoveList,
    actions.actInsertMoveLists,
  );

  async function _updateMoveList(oldMoveList: MoveListT, newMoveList: MoveListT) {
    actions.actAddMoveLists(querySetListToDict([newMoveList]));
    await browseToMove([makeMoveListUrl(newMoveList)], true);
  }

  return (
    <div className="appFrame px-4 flex flex-col">
      {createToastr()}
      <div className="flex flex-row justify-between h-16">
        <h1 onClick={() => alert("TODO")}>Lindy Science</h1>
        <AccountMenu
          className=""
          userProfile={props.userProfile}
          signIn={() => navigate("/app/sign-in/")}
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
