// @flow

import * as React from "react";

// $FlowFixMe
export const SessionContainerContext = React.createContext({});

export const withSessionCtr = (WrappedComponent: any) => (props: any) => {
  return (
    <SessionContainerContext.Consumer>
      {sessionCtr => <WrappedComponent {...props} sessionCtr={sessionCtr} />}
    </SessionContainerContext.Consumer>
  );
};
