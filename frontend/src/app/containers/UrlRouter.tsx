import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import { compose } from 'lodash/fp';

import { Navigation } from 'src/session/facets/Navigation';
import { AuthSwitch } from 'src/app/containers/AuthSwitch';
import { ListsSwitch } from 'src/app/containers/ListsSwitch';
import { useDefaultProps, FC } from 'react-default-props-context';
import { UserProfileT } from 'src/profiles/types';
import { IndexPage } from 'src/app/containers/IndexPage';
import { ProfilePage } from 'src/session/containers/ProfilePage';
import { SearchResultsPage } from 'src/search/containers/SearchResultsPage';

type PropsT = {};

type DefaultPropsT = {
  userProfile: UserProfileT;
  navigation: Navigation;
};

export const UrlRouter: FC<PropsT, DefaultPropsT> = compose(observer)(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    return (
      <Router history={props.navigation.history}>
        <Switch>
          <Route exact path="/">
            <IndexPage userProfile={props.userProfile} />
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
  }
);
