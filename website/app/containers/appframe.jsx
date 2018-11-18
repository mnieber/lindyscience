// @flow

import jquery from 'jquery';
import React from 'react'
import { useEffect } from 'react';
import { connect } from 'react-redux'
import { querySetListToDict, createToastr } from 'utils/utils'
import { AccountMenu } from 'app/presentation/accountmenu';
import { browserHistory } from 'react-router'

import * as movesActions from 'moves/actions'
import * as appActions from 'app/actions'
import * as fromAppStore from 'app/reducers'
import * as fromMovesStore from 'moves/reducers'
import * as movesApi from 'moves/api'
import * as appApi from 'app/api'
import type { UUID } from 'app/types';


// AppFrame

function AppFrame({
  selectedMoveListId,
  loggedInUserName,
  ioStatus,
  actSetIOStatus,
  actSetVotes,
  actAddMoveLists,
  actAddVideoLinks,
  actAddTips,
  actAddMovePrivateDatas,
  actSetUserProfile,
  actSelectMoveListById,
  children,
}: {
  selectedMoveListId: UUID,
  loggedInUserName: string,
  ioStatus: string,
  actSetIOStatus: Function,
  actSetVotes: Function,
  actAddMoveLists: Function,
  actAddVideoLinks: Function,
  actAddTips: Function,
  actAddMovePrivateDatas: Function,
  actSetUserProfile: Function,
  actSelectMoveListById: Function,
  children: any,
}) {
  async function _load() {
    // load non-user-specific data, and user profile
    const [moveLists, profile] = await Promise.all([
      movesApi.loadMoveLists(),
      // $FlowFixMe
      appApi.loadUserProfile(globalUserProfile)
    ]);
    actAddMoveLists(moveLists.entities.moveLists || {}, {});
    actSetUserProfile(profile);
    actSelectMoveListById(profile.recentMoveListId);

    // load user profile
    const [userVotes] = await Promise.all([
      movesApi.loadUserVotes()
    ]);
    actSetVotes(userVotes);

    // load selected move list
    if (selectedMoveListId) {
      const [moveList] = await Promise.all([
        movesApi.loadMoveList(selectedMoveListId)
      ]);
      actAddMoveLists(moveList.entities.moveLists, moveList.entities.moves || {});
      actAddVideoLinks(moveList.entities.videoLinks || {});
      actAddTips(moveList.entities.tips || {});
      actAddMovePrivateDatas(moveList.entities.movePrivateDatas || {});
    }
  }

  useEffect(() => {
    const _log = process.env.NODE_ENV === 'production'
      ? function(e) {}
      : console .log;

    actSetIOStatus("loading");
    try {
      _load();

      // finish try
      actSetIOStatus("ok");
    }
    catch(e) {
      _log(e);
      actSetIOStatus("error");
    }
  });

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
          loggedInUserName={loggedInUserName}
          signIn={signIn}
        />
      </div>
      <React.Fragment>
        {children}
      </React.Fragment>
    </div>
  );
};

// $FlowFixMe
AppFrame = connect(
  (state) => ({
    loggedInUserName: fromAppStore.getLoggedInUserName(state.app),
    selectedMoveListId: fromMovesStore.getSelectedMoveListId(state.moves),
    ioStatus: fromAppStore.getIOStatus(state.app),
  }),
  {
    ...movesActions,
    ...appActions,
  }
)(AppFrame)

export default AppFrame;
