// @flow

import jquery from 'jquery';
import React from 'react'
import { connect } from 'react-redux'
import { querySetListToDict, createToastr } from 'utils/utils'
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
  signedInUsername: string,
  actSetSignedInUsername: Function,
  actSetUserProfile: Function,
  actSetVotes: Function,
  actAddMoveLists: Function,
  actAddVideoLinks: Function,
  actAddTips: Function,
  actAddMovePrivateDatas: Function,
  children: any,
};

function AppFrame(props: AppFramePropsT) {
  const [hasLoadedMoveLists, setHasLoadedMoveLists] = React.useState(null);
  const [loadedUsername, setLoadedUsername] = React.useState("");
  const [loadedMoveListId, setLoadedMoveListId] = React.useState("");

  async function _loadMoveListsAndUsername() {
    if (hasLoadedMoveLists === null) {
      setHasLoadedMoveLists(false);

      const [username, moveLists] = await Promise.all([
        appApi.getUsername(),
        movesApi.loadMoveLists(),
      ]);
      if (username) {
        props.actSetSignedInUsername(username);
      }
      props.actAddMoveLists(moveLists.entities.moveLists || {}, {});
      setHasLoadedMoveLists(true);
    }
  }

  async function _loadUserProfile() {
    if (hasLoadedMoveLists && loadedUsername != props.signedInUsername) {
      const [profile, votes, movePrivateDatas] = await Promise.all([
        appApi.loadUserProfile(),
        appApi.loadUserVotes(),
        movesApi.loadMovePrivateDatas()
      ]);
      props.actSetUserProfile(profile);
      props.actSetVotes(votes);
      props.actAddMovePrivateDatas(movePrivateDatas.entities.movePrivateDatas || {});

      setLoadedUsername(props.signedInUsername);
    }
  }

  async function _loadSelectedMoveList() {
    if (hasLoadedMoveLists && loadedMoveListId != props.selectedMoveListId) {
      const [moveList] = await Promise.all([
        movesApi.loadMoveList(props.selectedMoveListId)
      ]);
      props.actAddMoveLists(moveList.entities.moveLists, moveList.entities.moves || {});
      props.actAddVideoLinks(moveList.entities.videoLinks || {});
      props.actAddTips(moveList.entities.tips || {});
      setLoadedMoveListId(props.selectedMoveListId);
    }
  }

  React.useEffect(() => {_loadMoveListsAndUsername()});
  React.useEffect(() => {_loadUserProfile()}, [hasLoadedMoveLists, props.signedInUsername]);
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
    signedInUsername: fromAppStore.getSignedInUsername(state.app),
    selectedMoveListId: fromMovesStore.getSelectedMoveListId(state.moves),
  }),
  {
    ...movesActions,
    ...appActions,
  },
  // mergeProps
)(AppFrame)

export default AppFrame;
