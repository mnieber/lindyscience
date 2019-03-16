// @flow

import React from "react";
import { Router, Link } from "@reach/router";
import MoveListFrame from "moves/containers/move_list_frame";
import MovePage from "moves/containers/move_page";
import MoveListDetailsPage from "moves/containers/move_list_details_page";
import AppFrame, { browseToMove } from "app/containers/appframe";
import SignInPage from "app/containers/signinpage";
import AppCtr from "app/containers/index";
import MovesCtr from "moves/containers/index";
import type { UserProfileT } from "app/types";

export type IndexPagePropsT = {
  userProfile: UserProfileT,
};

function IndexPage(props: IndexPagePropsT) {
  function _loadRecentMove() {
    if (props.userProfile && props.userProfile.recentMoveUrl) {
      browseToMove([props.userProfile.recentMoveUrl], false);
    }
  }
  React.useEffect(() => {
    _loadRecentMove();
  }, [props.userProfile]);

  return <React.Fragment />;
}

type UrlRouterPropsT = {
  userProfile: UserProfileT,
};

function UrlRouter(props: UrlRouterPropsT) {
  return (
    // $FlowFixMe
    <Router primary={false} id="reachRouter">
      <AppFrame path="/app">
        <IndexPage path="/list" userProfile={props.userProfile} />
        <MoveListFrame path="/list/:ownerUsername/:moveListSlug">
          <MoveListDetailsPage path="/" />
          <MovePage path=":moveSlug" />
          <MovePage path=":moveSlug/:moveId" />
        </MoveListFrame>
        <SignInPage path="/sign-in/" />
      </AppFrame>
    </Router>
  );
}

// $FlowFixMe
UrlRouter = AppCtr.connect(
  state => ({
    userProfile: AppCtr.fromStore.getUserProfile(state.app),
  }),
  {
    ...MovesCtr.actions,
  }
)(UrlRouter);

export default UrlRouter;
