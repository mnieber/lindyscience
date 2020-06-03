// @flow

import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Ctr from 'src/screens/containers/index';
import { IndexPage } from 'src/screens/containers/IndexPage';
import { compose } from 'redux';
import { CutVideoCtrProvider } from 'src/screens/cut_video_container/cut_video_container_provider';
import { mergeDefaultProps, withDefaultProps } from 'src/mergeDefaultProps';
import { SessionCtrProvider } from 'src/screens/session_container/session_container_provider';
import { MoveListsCtrProvider } from 'src/screens/movelists_container/movelists_container_provider';
import { MovesCtrProvider } from 'src/screens/moves_container/moves_container_provider';
import { MoveCtrProvider } from 'src/screens/move_container/move_container_provider';
import { makeSlugid } from 'src/screens/utils';
import { Navigation } from 'src/screens/session_container/facets/navigation';
import MovePage from 'src/screens/containers/move_page';
import MoveListDetailsPage from 'src/screens/containers/move_list_details_page';
import AppFrame from 'src/screens/containers/appframe';
import SearchResultsPage from 'src/screens/containers/search_results_page';
import SignInPage from 'src/app/containers/signinpage';
import RegisterPage from 'src/app/containers/register_page';
import { MoveListFrame } from 'src/screens/containers/move_list_frame';
import PasswordResetPage from 'src/app/containers/password_reset_page';
import ProfilePage from 'src/screens/containers/profile_page';
import type { UserProfileT } from 'src/profiles/types';

const withMoveTarget = compose(
  withDefaultProps,
  (WrappedComponent: any) => (p: any) => {
    const props = mergeDefaultProps(p);
    React.useEffect(() => {
      const navigation = Navigation.get(props.sessionCtr);
      const params = props.match.params;
      navigation.requestData({
        moveSlugid: makeSlugid(params.moveSlug, params.moveId),
        moveListUrl: params.ownerUsername + '/' + params.moveListSlug,
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
        moveListUrl: params.ownerUsername + '/' + params.moveListSlug,
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
            '/app/lists/:ownerUsername/:moveListSlug/:moveSlug',
            '/app/lists/:ownerUsername/:moveListSlug/:moveSlug/:moveId',
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
UrlRouter = Ctr.connect((state) => ({
  userProfile: Ctr.fromStore.getUserProfile(state),
}))(UrlRouter);

export default UrlRouter;
