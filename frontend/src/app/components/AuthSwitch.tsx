import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { SignInPage } from 'src/session/components/SignInPage';
import { SignUpPage } from 'src/session/components/SignUpPage';
import { PasswordResetPage } from 'src/session/components/PasswordResetPage';
import { AuthStateProvider } from 'src/session/AuthStateProvider';

export const AuthSwitch: React.FC = () => {
  return (
    <AuthStateProvider>
      <Switch>
        <Route exact path="/sign-in">
          <SignInPage />
        </Route>
        <Route exact path="/sign-up">
          <SignUpPage />
        </Route>
        <Route exact path="/activate/:uid/:token">
          <SignUpPage />
        </Route>
        <Route exact path="/request-password-reset">
          <PasswordResetPage />
        </Route>
        <Route exact path="/reset-password/:uid/:token">
          <PasswordResetPage />
        </Route>
      </Switch>
    </AuthStateProvider>
  );
};
