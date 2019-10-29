// @flow

import * as React from "react";

import { MovesContainer } from "screens/moves_container/moves_container";
import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { SessionContainer } from "screens/session_container/session_container";
import { sessionContainerProps } from "screens/session_container/session_container_props";

// $FlowFixMe
export const SessionContainerContext = React.createContext({});

export const withSessionCtr = (WrappedComponent: any) => (props: any) => {
  return (
    <SessionContainerContext.Consumer>
      {sessionCtr => <WrappedComponent {...props} sessionCtr={sessionCtr} />}
    </SessionContainerContext.Consumer>
  );
};

export function useSessionCtr(dispatch: Function, history: any) {
  const [sessionCtr, setSessionCtr] = React.useState(() => {
    const result = new SessionContainer(
      sessionContainerProps(dispatch, history)
    );
    result.profiling.loadEmail();
    return result;
  });
  return sessionCtr;
}
