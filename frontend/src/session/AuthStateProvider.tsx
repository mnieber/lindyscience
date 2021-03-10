import React from 'react';
import { action, observable, computed } from 'mobx';
import { useStore } from 'src/app/components/StoreProvider';
import * as _ from 'lodash/fp';

import { AuthenticationStore } from 'src/session/AuthenticationStore';

class AuthState {
  @observable errors: string[] = [];
  @observable state: string = 'initial';

  constructor(authenticationStore: AuthenticationStore) {
    authenticationStore.signal.add((event) => this.handleMsg(event));
  }

  @computed get hasErrors() {
    return !_.isEmpty(this.errors);
  }

  @action reset = () => {
    this.errors = [];
    this.state = 'initial';
  };

  handleMsg = (msg: any) => {
    this.errors = msg.details?.errors ?? [];
    this.state = msg.topic;
  };
}

export const AuthStateContext = React.createContext<AuthState | undefined>(
  undefined
);

type PropsT = React.PropsWithChildren<{}>;

export const AuthStateProvider: React.FC<PropsT> = (props: PropsT) => {
  const { authenticationStore } = useStore();
  const [authState] = React.useState(() => new AuthState(authenticationStore));

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
