// @flow

import React from "react";
import { Router } from "@reach/router";
import MoveListFrame from "screens/containers/move_list_frame";
import MovePage from "screens/containers/move_page";
import MoveListDetailsPage from "screens/containers/move_list_details_page";
import AppFrame from "screens/containers/appframe";
import SearchResultsPage from "screens/containers/search_results_page";
import SignInPage from "app/containers/signinpage";
import RegisterPage from "app/containers/register_page";
import PasswordResetPage from "app/containers/password_reset_page";
import ProfilePage from "screens/containers/profile_page";
import Ctr, { browseToMoveUrl } from "screens/containers/index";
import type { UserProfileT } from "profiles/types";

export type IndexPagePropsT = {
  userProfile: UserProfileT,
};

function IndexPage(props: IndexPagePropsT) {
  function _loadRecentMove() {
    if (props.userProfile && props.userProfile.recentMoveUrl) {
      browseToMoveUrl([props.userProfile.recentMoveUrl], false);
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
        <ProfilePage path="/lists/:ownerUsernamePrm" />
        <MoveListFrame path="/lists/:ownerUsernamePrm/:moveListSlugPrm">
          <SearchResultsPage path="/search" />
          <MoveListDetailsPage path="/" />
          <MovePage path=":moveSlugPrm" />
          <MovePage path=":moveSlugPrm/:moveIdPrm" />
        </MoveListFrame>
        <SearchResultsPage path="/search" />
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
UrlRouter = Ctr.connect(state => ({
  userProfile: Ctr.fromStore.getUserProfile(state),
}))(UrlRouter);

export default UrlRouter;
