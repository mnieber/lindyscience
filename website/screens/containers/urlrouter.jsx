// @flow

import React from "react";
import { compose } from "redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { CutVideoCtrProvider } from "screens/cut_video_container/cut_video_container_provider";
import { mergeDefaultProps, withDefaultProps } from "facet/default_props";
import { SessionCtrProvider } from "screens/session_container/session_container_provider";
import { MoveListsCtrProvider } from "screens/movelists_container/movelists_container_provider";
import { MovesCtrProvider } from "screens/moves_container/moves_container_provider";
import { MoveCtrProvider } from "screens/move_container/move_container_provider";
import { helpUrl } from "moves/utils";
import { makeSlugid } from "screens/utils";
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

  function _loadRecentMove() {
    const url =
      props.userProfile && props.userProfile.recentMoveUrl
        ? props.userProfile.recentMoveUrl
        : helpUrl.substr("/app/lists/".length);
    browseToMoveUrl(history.push, [url], false);
  }
  React.useEffect(() => {
    _loadRecentMove();
  }, [props.userProfile]);

  return <div className="h-full" />;
}

const withMoveTarget = compose(
  withDefaultProps,
  (WrappedComponent: any) => (p: any) => {
    const props = mergeDefaultProps(p);
    React.useEffect(() => {
      const navigation = Navigation.get(props.sessionCtr);
      const params = props.match.params;
      navigation.requestData({
        moveSlugid: makeSlugid(params.moveSlug, params.moveId),
        moveListUrl: params.ownerUsername + "/" + params.moveListSlug,
      });
    });
    return <WrappedComponent {...p} />;
  }
);

const withMoveListTarget = compose(
  withDefaultProps,
  (WrappedComponent: any) => (p: any) => {
    const props = mergeDefaultProps(p);
    React.useEffect(() => {
      const navigation = Navigation.get(props.sessionCtr);
      const params = props.match.params;
      navigation.requestData({
        moveListUrl: params.ownerUsername + "/" + params.moveListSlug,
      });
    });
    return <WrappedComponent {...p} />;
  }
);

function ListsSwitch() {
  return (
    // $FlowFixMe
    <MoveListFrame>
      <Switch>
        <Route exact path="/app/lists/:ownerUsername/:moveListSlug">
          {compose(withMoveListTarget)(() => (
            <CutVideoCtrProvider>
              <MoveListDetailsPage />
            </CutVideoCtrProvider>
          ))}
        </Route>
        <Route
          exact
          path={[
            "/app/lists/:ownerUsername/:moveListSlug/:moveSlug",
            "/app/lists/:ownerUsername/:moveListSlug/:moveSlug/:moveId",
          ]}
        >
          {compose(withMoveTarget)(() => (
            <MoveCtrProvider>
              <MovePage />
            </MoveCtrProvider>
          ))}
        </Route>
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
      <SessionCtrProvider>
        <MoveListsCtrProvider>
          <MovesCtrProvider>
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
          </MovesCtrProvider>
        </MoveListsCtrProvider>
      </SessionCtrProvider>
    </Router>
  );
}

// $FlowFixMe
UrlRouter = Ctr.connect(state => ({
  userProfile: Ctr.fromStore.getUserProfile(state),
}))(UrlRouter);

export default UrlRouter;
