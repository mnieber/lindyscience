import { MoveListFrame } from "screens/containers/move_list_frame";

// @flow

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useHistory } from "utils/react_router_dom_wrapper";
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
  const history = useHistory();

  function _loadRecentMove() {
    if (props.userProfile && props.userProfile.recentMoveUrl) {
      browseToMoveUrl(history, [props.userProfile.recentMoveUrl], false);
    }
  }
  React.useEffect(() => {
    _loadRecentMove();
  }, [props.userProfile]);

  return <div className="h-full" />;
}

type UrlRouterPropsT = {
  userProfile: UserProfileT,
};

function ListsRouter() {
  return (
    <MoveListFrame>
      <Switch>
        <Route exact path="/app/lists/:ownerUsername/:moveListSlug">
          <MoveListDetailsPage />
        </Route>
        <Route exact path="/app/lists/:ownerUsername/:moveListSlug/:moveSlug">
          <MovePage />
        </Route>
        <Route
          exact
          path="/app/lists/:ownerUsername/:moveListSlug/:moveSlug/:moveId"
        >
          <MovePage />
        </Route>
      </Switch>
    </MoveListFrame>
  );
}

function SignInRouter() {
  return (
    <Switch>
      <Route exact path="/app/sign-in">
        <SignInPage />
      </Route>
      <Route exact path="/app/register">
        <RegisterPage />
      </Route>
      <Route exact path="/app/register/activate/:uid/:token">
        <RegisterPage />
      </Route>
      <Route exact path="/app/sign-in/reset-password">
        <PasswordResetPage />
      </Route>
      <Route exact path="/app/sign-in/reset-password/:uid/:token">
        <PasswordResetPage />
      </Route>
    </Switch>
  );
}

function UrlRouter(props: UrlRouterPropsT) {
  return (
    <Router>
      <AppFrame>
        <Switch>
          <Route exact path="/app/">
            <IndexPage userProfile={props.userProfile} />
          </Route>
          <Route exact path="/app/people/:username">
            <ProfilePage />
          </Route>
          <Route exact path="/app/lists/:ownerUsername/:moveListSlug/search">
            <SearchResultsPage />
          </Route>
          <ListsRouter />
          <SignInRouter />
        </Switch>
      </AppFrame>
    </Router>
  );
}

// $FlowFixMe
UrlRouter = Ctr.connect(state => ({
  userProfile: Ctr.fromStore.getUserProfile(state),
}))(UrlRouter);

export default UrlRouter;
