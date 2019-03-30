// @flow

import React from "react";
import { Router } from "@reach/router";
import MoveListFrame from "moves/containers/move_list_frame";
import MovePage from "moves/containers/move_page";
import MoveListDetailsPage from "moves/containers/move_list_details_page";
import AppFrame from "app/containers/appframe";
import SearchMovesPage from "moves/containers/search_moves_page";
import SignInPage from "app/containers/signinpage";
import RegisterPage from "app/containers/register_page";
import PasswordResetPage from "app/containers/password_reset_page";
import ProfilePage from "moves/containers/profile_page";
import AppCtr, { browseToMove } from "app/containers/index";
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
        <IndexPage path="/lists" userProfile={props.userProfile} />
        <SearchMovesPage path="/search" />
        <ProfilePage path="/lists/:ownerUsernamePrm" />
        <MoveListFrame path="/lists/:ownerUsernamePrm/:moveListSlugPrm">
          <MoveListDetailsPage path="/" />
          <MovePage path=":moveSlugPrm" />
          <MovePage path=":moveSlugPrm/:moveIdPrm" />
        </MoveListFrame>
        <SignInPage path="/sign-in/" />
        <RegisterPage path="/register/" />
        <RegisterPage path="/register/activate/:uidPrm/:tokenPrm" />
        <PasswordResetPage path="/sign-in/reset-password" />
        <PasswordResetPage path="/sign-in/reset-password/:uidPrm/:tokenPrm" />
      </AppFrame>
    </Router>
  );
}

// $FlowFixMe
UrlRouter = AppCtr.connect(
  state => ({
    userProfile: AppCtr.fromStore.getUserProfile(state),
  }),
  {
    ...MovesCtr.actions,
  }
)(UrlRouter);

export default UrlRouter;
