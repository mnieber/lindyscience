// @flow

import React from "react";
import { compose } from "redux";

import type { MoveByIdT } from "moves/types";
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
import { useHistory, withRouter } from "utils/react_router_dom_wrapper";
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
  moveById: MoveByIdT,
};

function AppFrame(props: AppFramePropsT) {
  const history = useHistory();

  const moveListsCtr = useMoveListsCtr(props.dispatch, history);
  const movesCtr = useMovesCtr(props.dispatch, history);
  const sessionCtr = useSessionCtr(
    props.dispatch,
    history,
    movesCtr,
    moveListsCtr
  );
  sessionCtr.setInputs(props.userProfile, props.inputMoveLists, props.moveById);

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
AppFrame = compose(
  withRouter,
  Ctr.connect(state => ({
    inputMoveLists: Ctr.fromStore.getMoveLists(state),
    userProfile: Ctr.fromStore.getUserProfile(state),
    moveById: Ctr.fromStore.getMoveById(state),
  }))
)(AppFrame);

export default AppFrame;
