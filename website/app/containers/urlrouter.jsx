// @flow

import React from 'react'
import { IndexRedirect, Router, Route, browserHistory } from 'react-router'
import MovesPage from 'moves/containers/movespage'
import AppFrame from 'app/containers/appframe'
import SignInPage from 'app/containers/signinpage'
import * as movesActions from 'moves/actions'
import { connect } from 'react-redux'


type UrlRouterPropsT = {
  actSelectMoveListByUserNameAndSlug: Function
};

function UrlRouter(props: UrlRouterPropsT) {
  const _openMovesPage = (nextState, replace) => {
    props.actSelectMoveListByUserNameAndSlug(
      nextState.params.ownerUsername, nextState.params.moveListSlug
    );
  };

  return (
    <Router history={browserHistory}>
      <Route path="/app" component={AppFrame}>
        <Route
          path="/app/moves/:ownerUsername/:moveListSlug(/:moveSlug)"
          onEnter={_openMovesPage}
          component={MovesPage}
        />
        <Route path="/app/sign-in/" component={SignInPage}/>
      </Route>
    </Router>
  );
}

// $FlowFixMe
UrlRouter = connect(
  (state) => ({
  }),
  {
    ...movesActions,
  }
)(UrlRouter)

export default UrlRouter;
