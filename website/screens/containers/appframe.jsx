// @flow

import React from "react";

import {
  MoveListsContainerContext,
  useMoveListsCtr,
} from "screens/movelists_container/movelists_container_context";
import {
  MovesContainerContext,
  useMovesCtr,
} from "screens/moves_container/moves_container_context";
import {
  SessionContainerContext,
  useSessionCtr,
} from "screens/session_container/session_container_context";
import type { MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import { useHistory, useParams } from "utils/react_router_dom_wrapper";
import { createToastr } from "app/utils";
import SearchMovesPage from "screens/containers/search_moves_page";
import { AccountMenu } from "app/presentation/accountmenu";
import Ctr from "screens/containers/index";
import type { UserProfileT } from "profiles/types";

// AppFrame
type AppFramePropsT = {
  userProfile: ?UserProfileT,
  children: any,
  dispatch: Function,
  inputMoveLists: Array<MoveListT>,
  inputMoves: Array<MoveT>,
};

function AppFrame(props: AppFramePropsT) {
  const history = useHistory();
  const params = useParams();

  const moveListsCtr = useMoveListsCtr(props.dispatch, history);
  moveListsCtr.setInputs(props.inputMoveLists, props.userProfile);

  const movesCtr = useMovesCtr(props.dispatch, history);
  movesCtr.setInputs(
    props.inputMoves,
    moveListsCtr.highlight.item,
    props.inputMoveLists,
    props.userProfile
  );

  const sessionCtr = useSessionCtr(
    props.dispatch,
    history,
    movesCtr,
    moveListsCtr
  );
  sessionCtr.setInputs(props.userProfile, params);

  const cookieNotice = sessionCtr.profiling.acceptsCookies ? (
    undefined
  ) : (
    <div className="cookieNotice flexrow justify-around items-center">
      <div>
        This site uses cookies to store the settings for the logged in user. By
        continuing to use this site you agree with that.
        <button
          className="button button--wide ml-2"
          onClick={sessionCtr.profiling.acceptCookies}
        >
          Okay
        </button>
      </div>
    </div>
  );

  return (
    <SessionContainerContext.Provider value={sessionCtr}>
      <MoveListsContainerContext.Provider value={moveListsCtr}>
        <MovesContainerContext.Provider value={movesCtr}>
          <div className="appFrame px-4 flexcol">
            {cookieNotice}
            {createToastr()}
            <div className="appFrame__banner flexrow items-center justify-between h-16 mt-4 mb-8">
              <div className="flexrow w-full">
                <h1 className="appFrame__home" onClick={() => alert("TODO")}>
                  Lindy Science
                </h1>
                <SearchMovesPage />
              </div>
              <AccountMenu
                className="self-start"
                userProfile={props.userProfile}
                signIn={() =>
                  history.push("/app/sign-in/?next=" + window.location.pathname)
                }
                signOut={sessionCtr.profiling.signOut}
              />
            </div>
            {props.children}
          </div>
        </MovesContainerContext.Provider>
      </MoveListsContainerContext.Provider>
    </SessionContainerContext.Provider>
  );
}

// $FlowFixMe
AppFrame = Ctr.connect(state => ({
  inputMoveLists: Ctr.fromStore.getMoveLists(state),
  userProfile: Ctr.fromStore.getUserProfile(state),
  inputMoves: Ctr.fromStore.getMovesInList(state),
  inputMoveLists: Ctr.fromStore.getMoveLists(state),
}))(AppFrame);

export default AppFrame;
