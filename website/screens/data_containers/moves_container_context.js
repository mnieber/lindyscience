import * as React from "react";

// $FlowFixMe
export const MovesContainerContext = React.createContext({});

export const withMovesCtr = (WrappedComponent: any) => (props: any) => {
  return (
    <MovesContainerContext.Consumer>
      {movesCtr => <WrappedComponent {...props} movesCtr={movesCtr} />}
    </MovesContainerContext.Consumer>
  );
};
