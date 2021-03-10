import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { observer } from 'mobx-react';

import { AuthSwitch } from 'src/app/containers/AuthSwitch';
import { ListsSwitch } from 'src/app/containers/ListsSwitch';
import { IndexPage } from 'src/app/containers/IndexPage';
import { ProfilePage } from 'src/session/containers/ProfilePage';
import { SearchResultsPage } from 'src/search/containers/SearchResultsPage';
import { useStore } from 'src/app/components/StoreProvider';

export const UrlRouter: React.FC = observer(() => {
  const { navigationStore } = useStore();

  return (
    <Router history={navigationStore.history}>
      <Switch>
        <Route exact path="/">
          <IndexPage />
        </Route>
        <Route exact path="/people/:username">
          <ProfilePage />
        </Route>
        <Route exact path="/search">
          <SearchResultsPage />
        </Route>
        <Route path="/lists/">
          <ListsSwitch />
        </Route>
        <Route path="/">
          <AuthSwitch />
        </Route>
      </Switch>
    </Router>
  );
});
