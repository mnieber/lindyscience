// @flow

import * as React from "react";

// $FlowFixMe
export const MoveListsContainerContext = React.createContext({});

export const withMoveListsCtr = (WrappedComponent: any) => (props: any) => {
  return (
    <MoveListsContainerContext.Consumer>
      {moveListsCtr => (
        <WrappedComponent {...props} moveListsCtr={moveListsCtr} />
      )}
    </MoveListsContainerContext.Consumer>
  );
};
