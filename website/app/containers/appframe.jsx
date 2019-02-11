// @flow

import jquery from 'jquery';
import React from 'react'
import { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { querySetListToDict, createToastr } from 'utils/utils'
import { AccountMenu } from 'app/presentation/accountmenu';
import { browserHistory } from 'react-router'
import { browseToMoveList } from 'moves/containers/movespage'

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
  actSetVotes: Function,
  actAddMoveLists: Function,
  actAddVideoLinks: Function,
  actAddTips: Function,
  actAddMovePrivateDatas: Function,
  actSetUserProfile: Function,
  children: any,
};

function AppFrame(props: AppFramePropsT) {
  const [hasLoadedMoveLists, setHasLoadedMoveLists] = useState(false);
  const [loadedUsername, setLoadedUsername] = useState("");

  async function _loadMoveLists() {
    if (!hasLoadedMoveLists) {
      const moveLists = await movesApi.loadMoveLists();
      props.actAddMoveLists(moveLists.entities.moveLists || {}, {});
      setHasLoadedMoveLists(true);
    }
  }

  const loggedInUsername = props.userProfile ? props.userProfile.username : "";

  async function _loadUserProfile() {
    if (hasLoadedMoveLists && loadedUsername != loggedInUsername) {
      const [profile, votes] = await Promise.all([
        appApi.loadUserProfile(),
        movesApi.loadUserVotes()
      ]);
      props.actSetUserProfile(profile);
      props.actSetVotes(votes);
      const recentMoveList = props.moveLists.find(x => x.id == profile.recentMoveListId);
      if (recentMoveList) {
        browseToMoveList(recentMoveList.ownerUsername, recentMoveList.slug);
      }

      setLoadedUsername(profile.username);
    }
  }

  async function _loadSelectedMoveList() {
    if (props.selectedMoveListId) {
      const [moveList] = await Promise.all([
        movesApi.loadMoveList(props.selectedMoveListId)
      ]);
      props.actAddMoveLists(moveList.entities.moveLists, moveList.entities.moves || {});
      props.actAddVideoLinks(moveList.entities.videoLinks || {});
      props.actAddTips(moveList.entities.tips || {});
      props.actAddMovePrivateDatas(moveList.entities.movePrivateDatas || {});
    }
  }

  useEffect(() => {_loadMoveLists()});
  useEffect(() => {_loadUserProfile()}, [hasLoadedMoveLists, loggedInUsername]);
  useEffect(() => {_loadSelectedMoveList()}, [props.selectedMoveListId]);

  function signIn() {
    browserHistory.push("/app/sign-in/");
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

// $FlowFixMe
AppFrame = connect(
  (state) => ({
    moveLists: fromMovesStore.getMoveLists(state.moves),
    userProfile: fromAppStore.getUserProfile(state.app),
    selectedMoveListId: fromMovesStore.getSelectedMoveListId(state.moves),
  }),
  {
    ...movesActions,
    ...appActions,
  }
)(AppFrame)

export default AppFrame;
