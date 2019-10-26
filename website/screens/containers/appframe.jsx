// @flow

import React from "react";

import { createToastr } from "app/utils";
import { SessionContainerContext } from "screens/session_container/session_container_context";
import { sessionContainerProps } from "screens/session_container/session_container_props";
import { SessionContainer } from "screens/session_container/session_container";
import { useHistory } from "utils/react_router_dom_wrapper";
import SearchMovesPage from "screens/containers/search_moves_page";
import { AccountMenu } from "app/presentation/accountmenu";
import Ctr from "screens/containers/index";
import type { UserProfileT } from "profiles/types";

function useSessionCtr(dispatch: Function, history: any) {
  const [sessionCtr, setSessionCtr] = React.useState(() => {
    const result = new SessionContainer(
      sessionContainerProps(dispatch, history)
    );
    result.data.loadEmail();
    return result;
  });
  return sessionCtr;
}

// AppFrame
type AppFramePropsT = {
  selectedMoveListUrl: string,
  userProfile: ?UserProfileT,
  children: any,
  dispatch: Function,
};

function AppFrame(props: AppFramePropsT) {
  const history = useHistory();

  const sessionCtr = useSessionCtr(props.dispatch, history);
  sessionCtr.setInputs(props.userProfile, props.selectedMoveListUrl);

  const cookieNotice = sessionCtr.data.acceptsCookies ? (
    undefined
  ) : (
    <div className="cookieNotice flexrow justify-around items-center">
      <div>
        This site uses cookies to store the settings for the logged in user. By
        continuing to use this site you agree with that.
        <button
          className="button button--wide ml-2"
          onClick={sessionCtr.data.acceptCookies}
        >
          Okay
        </button>
      </div>
    </div>
  );

  return (
    <SessionContainerContext.Provider value={sessionCtr}>
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
            signOut={sessionCtr.data.signOut}
          />
        </div>
        {props.children}
      </div>
    </SessionContainerContext.Provider>
  );
}

// $FlowFixMe
AppFrame = Ctr.connect(state => ({
  userProfile: Ctr.fromStore.getUserProfile(state),
  selectedMoveListUrl: Ctr.fromStore.getSelectedMoveListUrl(state),
}))(AppFrame);

export default AppFrame;
