// @flow

import React from "react";
import { compose } from "redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { withSessionCtr } from "screens/session_container/session_container_context";
import { Navigation } from "screens/session_container/facets/navigation";
import { useHistory } from "utils/react_router_dom_wrapper";
import MovePage from "screens/containers/move_page";
import MoveListDetailsPage from "screens/containers/move_list_details_page";
import AppFrame from "screens/containers/appframe";
import SearchResultsPage from "screens/containers/search_results_page";
import SignInPage from "app/containers/signinpage";
import RegisterPage from "app/containers/register_page";
import { MoveListFrame } from "screens/containers/move_list_frame";
import PasswordResetPage from "app/containers/password_reset_page";
import ProfilePage from "screens/containers/profile_page";
import Ctr, { browseToMoveUrl } from "screens/containers/index";
import type { UserProfileT } from "profiles/types";

export type IndexPagePropsT = {
  userProfile: UserProfileT,
};

function IndexPage(props: IndexPagePropsT) {
  const history = useHistory();

  // TODO: use navigation.browseToRecentMove()
  function _loadRecentMove() {
    if (props.userProfile && props.userProfile.recentMoveUrl) {
      browseToMoveUrl(history.push, [props.userProfile.recentMoveUrl], false);
    }
  }
  React.useEffect(() => {
    _loadRecentMove();
  }, [props.userProfile]);

  return <div className="h-full" />;
}

const withUrlParams = compose(
  withSessionCtr,
  (WrappedComponent: any) => (props: any) => {
    React.useEffect(() => {
      Navigation.get(props.sessionCtr).setUrlParams(props.match.params);
    });
    return <WrappedComponent {...props} />;
  }
);

function ListsSwitch() {
  return (
    <MoveListFrame>
      <Switch>
        <Route
          exact
          path="/app/lists/:ownerUsername/:moveListSlug"
          component={withUrlParams(MoveListDetailsPage)}
        />
        <Route
          exact
          path="/app/lists/:ownerUsername/:moveListSlug/:moveSlug"
          component={withUrlParams(MovePage)}
        />
        <Route
          exact
          path="/app/lists/:ownerUsername/:moveListSlug/:moveSlug/:moveId"
          component={withUrlParams(MovePage)}
        />
      </Switch>
    </MoveListFrame>
  );
}

function SignInSwitch() {
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

type UrlRouterPropsT = {
  userProfile: UserProfileT,
};

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
          <Route exact path="/app/search">
            <SearchResultsPage />
          </Route>
          <Route path="/app/lists/">
            <ListsSwitch />
          </Route>
          <Route path="/">
            <SignInSwitch />
          </Route>
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
