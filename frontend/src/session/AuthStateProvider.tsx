import React from 'react';
import { observable, computed } from 'mobx';
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

  handleMsg = (msg: any) => {
    this.errors = msg.details.errors;
    this.state = msg.topic;
  };
}

export const AuthStateContext = React.createContext<AuthState | undefined>(
  undefined
);

interface IProps {
  authentication: Authentication;
  children: any;
}

export const AuthStateProvider: React.FC<IProps> = (props: IProps) => {
  const [authState] = React.useState(() => new AuthState(props.authentication));

  return (
    <AuthStateContext.Provider value={authState}>
      {props.children}
    </AuthStateContext.Provider>
  );
};

export const useAuthStateContext = (): AuthState => {
  const authState = React.useContext(AuthStateContext);
  if (!authState) {
    throw Error('No auth state');
  }
  return authState;
};
