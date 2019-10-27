// @flow

import React from "react";

import { moveListUrl } from "screens/utils";
import type { TagT } from "tags/types";
import type { MoveListT } from "move_lists/types";
import type { MoveT } from "moves/types";
import { useHistory, useParams } from "utils/react_router_dom_wrapper";
import { MoveListsContainerContext } from "screens/movelists_container/movelists_container_context";
import { MovesContainerContext } from "screens/moves_container/moves_container_context";
import { MovesContainer } from "screens/moves_container/moves_container";
import { movesContainerProps } from "screens/moves_container/moves_container_props";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { moveListsContainerProps } from "screens/movelists_container/movelists_container_props";
import { actSetSelectedMoveListUrl } from "screens/actions";
import { listen } from "facets/index";
import { Selection } from "facets/generic/selection";
import {
  browseToMove,
  browseToMoveList,
} from "screens/session_container/handlers/update_url";
import { createToastr } from "app/utils";
import { SessionContainerContext } from "screens/session_container/session_container_context";
import { sessionContainerProps } from "screens/session_container/session_container_props";
import { SessionContainer } from "screens/session_container/session_container";
import SearchMovesPage from "screens/containers/search_moves_page";
import { AccountMenu } from "app/presentation/accountmenu";
import Ctr from "screens/containers/index";
import type { UserProfileT } from "profiles/types";

function useSessionCtr(dispatch: Function, history: any) {
  const [sessionCtr, setSessionCtr] = React.useState(() => {
    const result = new SessionContainer(
      sessionContainerProps(dispatch, history)
    );
    result.profiling.loadEmail();
    return result;
  });
  return sessionCtr;
}

function useMovesCtr(dispatch: Function, history: any) {
  const [movesCtr, setMovesCtr] = React.useState(() => {
    return new MovesContainer(movesContainerProps(dispatch, history));
  });
  return movesCtr;
}

function useMoveListsCtr(dispatch: Function, history: any) {
  const [moveListsCtr, setMoveListsCtr] = React.useState(() => {
    return new MoveListsContainer(moveListsContainerProps(dispatch, history));
  });
  return moveListsCtr;
}

// AppFrame
type AppFramePropsT = {
  selectedMoveListUrl: string,
  userProfile: ?UserProfileT,
  children: any,
  dispatch: Function,
  inputMoveLists: Array<MoveListT>,
  inputMoves: Array<MoveT>,
};

function AppFrame(props: AppFramePropsT) {
  const history = useHistory();
  const params = useParams();

  const [blackboard, setBlackboard] = React.useState({
    ignoreHighlightChanges: false,
  });

  const moveListsCtr = useMoveListsCtr(props.dispatch, history);
  moveListsCtr.setInputs(props.inputMoveLists, props.userProfile);

  const moveListMatchingUrl = props.inputMoveLists.find(
    moveList =>
      moveList.ownerUsername == params.ownerUsername &&
      moveList.slug == params.moveListSlug
  );

  React.useEffect(() => {
    if (moveListMatchingUrl) {
      blackboard.ignoreHighlightChanges = true;
      Selection.get(moveListsCtr).selectItem({
        itemId: moveListMatchingUrl.id,
        isShift: false,
        isCtrl: false,
      });
      blackboard.ignoreHighlightChanges = false;
    }
  }, [moveListMatchingUrl]);

  React.useEffect(() => {
    props.dispatch(
      actSetSelectedMoveListUrl(params.ownerUsername, params.moveListSlug)
    );
  }, [params.ownerUsername, params.moveListSlug]);

  const movesCtr = useMovesCtr(props.dispatch, history);

  movesCtr.setInputs(
    props.inputMoves,
    moveListsCtr.highlight.item,
    props.inputMoveLists,
    props.userProfile
  );

  // TODO: move to sessionCtr
  React.useEffect(() => {
    listen(moveListsCtr.highlight, "highlightItem", id => {
      if (moveListsCtr.highlight.item && !blackboard.ignoreHighlightChanges) {
        browseToMoveList(history, moveListsCtr.highlight.item);
      }
    });
    listen(movesCtr.highlight, "highlightItem", id => {
      if (movesCtr.highlight.item) {
        browseToMove(
          history,
          moveListsCtr.highlight.item,
          movesCtr.data.preview,
          movesCtr.highlight.item
        );
      }
    });
  }, []);

  const sessionCtr = useSessionCtr(props.dispatch, history);
  const requestedMoveUrl = moveListUrl(
    params.ownerUsername,
    params.moveListSlug
  );
  sessionCtr.setInputs(
    props.userProfile,
    props.selectedMoveListUrl,
    requestedMoveUrl
  );

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
  selectedMoveListUrl: Ctr.fromStore.getSelectedMoveListUrl(state),
  inputMoves: Ctr.fromStore.getMovesInList(state),
  inputMoveLists: Ctr.fromStore.getMoveLists(state),
}))(AppFrame);

export default AppFrame;
