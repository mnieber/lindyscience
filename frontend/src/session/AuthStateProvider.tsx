import React from 'react';
import { action, observable, computed } from 'mobx';
import * as _ from 'lodash/fp';
import { subscribe } from 'facet';

import { Authentication } from 'src/session/facets/Authentication';

class AuthState {
  @observable errors: string[] = [];
  state: string = 'initial';

  constructor(authentication: Authentication) {
    subscribe(authentication, '*', this.handleMsg);
  }

  @computed get hasErrors() {
    return !_.isEmpty(this.errors);
  }

  @action reset = () => {
    this.errors = [];
    this.state = 'initial';
  };

  handleMsg = (msg: any) => {
    this.errors = msg.details.errors;
    this.state = msg.topic;
  };
}

export const AuthStateContext = React.createContext<AuthState | undefined>(
  undefined
);

interface PropsT {
  authentication: Authentication;
}

export const AuthStateProvider: React.FC<PropsT> = (
  props: React.PropsWithChildren<PropsT>
) => {
  const [authState] = React.useState(() => new AuthState(props.authentication));

  return (
    <AuthStateContext.Provider value={authState}>
      {props.children}
    </AuthStateContext.Provider>
  );
};

export const useAuthStateContext = (reset: boolean = false): AuthState => {
  const authState = React.useContext(AuthStateContext);
  React.useEffect(() => {
    if (authState && reset) {
      authState.reset();
    }
  }, [authState, reset]);

  if (!authState) {
    throw Error('No auth state');
  }
  return authState;
};
