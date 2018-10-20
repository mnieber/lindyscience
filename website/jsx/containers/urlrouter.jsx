import React from 'react'
import { IndexRedirect, Router, Route, browserHistory } from 'react-router'
import MovesPage from 'jsx/containers/movespage'
import MovePage from 'jsx/containers/movepage'
import AppFrame from 'jsx/containers/appframe'


export default class UrlRouter extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/app" component={AppFrame}>
          <Route path="/app/moves" component={MovesPage}/>
        </Route>
      </Router>
    );
  }
}
