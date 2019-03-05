// @flow

import jquery from 'jquery';
import React from 'react'
import { connect } from 'react-redux'
import { querySetListToDict, getObjectValues } from 'utils/utils'
import { createToastr } from 'app/utils'
import { AccountMenu } from 'app/presentation/accountmenu';
import { navigate } from "@reach/router"

import * as movesActions from 'moves/actions'
import * as appActions from 'app/actions'
import * as fromAppStore from 'app/reducers'
import * as fromMovesStore from 'moves/reducers'
import * as movesApi from 'moves/api'
import * as appApi from 'app/api'
import type { UUID, UserProfileT } from 'app/types';
import type { MoveListT } from 'moves/types';


// AppFrame
type AppFramePropsT = {
  moveLists: Array<MoveListT>,
  selectedMoveListId: UUID,
  userProfile: ?UserProfileT,
  signedInEmail: string,
  children: any,
  // also receive any actions
};

function AppFrame(props: AppFramePropsT) {
  const actions: any = props;

  const [hasLoadedMoveLists, setHasLoadedMoveLists] = React.useState(null);
  const [loadedEmail, setLoadedEmail] = React.useState("");
  const [loadedMoveListId, setLoadedMoveListId] = React.useState("");

  async function _loadMoveListsAndEmail() {
    if (hasLoadedMoveLists === null) {
      setHasLoadedMoveLists(false);

      const [email, moveLists] = await Promise.all([
        appApi.getEmail(),
        movesApi.loadMoveLists(),
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
        appApi.loadUserProfile(),
        appApi.loadUserVotes(),
        movesApi.loadMovePrivateDatas()
      ]);
      actions.actSetUserProfile(profile);
      actions.actSetVotes(votes);
      actions.actAddMovePrivateDatas(movePrivateDatas.entities.movePrivateDatas || {});

      setLoadedEmail(props.signedInEmail);
    }
  }

  async function _loadSelectedMoveList() {
    if (hasLoadedMoveLists && loadedMoveListId != props.selectedMoveListId) {
      const [moveList] = await Promise.all([
        movesApi.loadMoveList(props.selectedMoveListId)
      ]);
      actions.actAddMoves(getObjectValues(moveList.entities.moves || {}));
      actions.actInsertMoveLists(moveList.entities.moveLists, "");
      actions.actAddVideoLinks(moveList.entities.videoLinks || {});
      actions.actAddTips(moveList.entities.tips || {});
      setLoadedMoveListId(props.selectedMoveListId);
    }
  }

  React.useEffect(() => {_loadMoveListsAndEmail()});
  React.useEffect(() => {_loadUserProfile()}, [hasLoadedMoveLists, props.signedInEmail]);
  React.useEffect(() => {_loadSelectedMoveList()}, [hasLoadedMoveLists, props.selectedMoveListId]);

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
        {props.children}
      </React.Fragment>
    </div>
  );
};

function mergeProps(state: any, actions: any,
  {
    children
  }: {
    children: any,
  }
) {
  return {
    ...state,
    ...actions,
    children,
  }
}

// $FlowFixMe
AppFrame = connect(
  (state) => ({
    moveLists: fromMovesStore.getMoveLists(state.moves),
    userProfile: fromAppStore.getUserProfile(state.app),
    signedInEmail: fromAppStore.getSignedInEmail(state.app),
    selectedMoveListId: fromMovesStore.getSelectedMoveListId(state.moves),
  }),
  {
    ...movesActions,
    ...appActions,
  },
  // mergeProps
)(AppFrame)

export default AppFrame;
