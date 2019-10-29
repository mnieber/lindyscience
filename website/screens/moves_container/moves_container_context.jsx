// @flow

import * as React from "react";

import {
  MovesContainer,
  type MovesContainerPropsT,
} from "screens/moves_container/moves_container";

// $FlowFixMe
export const MovesContainerContext = React.createContext({});

export const withMovesCtr = (WrappedComponent: any) => (props: any) => {
  return (
    <MovesContainerContext.Consumer>
      {movesCtr => <WrappedComponent {...props} movesCtr={movesCtr} />}
    </MovesContainerContext.Consumer>
  );
};

export function useMovesCtr(props: MovesContainerPropsT) {
  const [movesCtr, setMovesCtr] = React.useState(() => {
    return new MovesContainer(props);
  });
  return movesCtr;
}
