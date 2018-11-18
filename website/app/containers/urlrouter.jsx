import React from 'react'
import { IndexRedirect, Router, Route, browserHistory } from 'react-router'
import MovesPage from 'moves/containers/movespage'
import AppFrame from 'app/containers/appframe'
import SignInPage from 'app/containers/signinpage'


export default class UrlRouter extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/app" component={AppFrame}>
          <Route path="/app/moves" component={MovesPage}/>
          <Route path="/app/sign-in/" component={SignInPage}/>
        </Route>
      </Router>
    );
  }
}
