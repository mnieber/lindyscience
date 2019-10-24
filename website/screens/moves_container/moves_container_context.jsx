import * as React from "react";

import { MovesContainer } from "screens/moves_container/moves_container";
import { movesContainerProps } from "screens/moves_container/moves_container_props";

// $FlowFixMe
export const MovesContainerContext = React.createContext({});

export const withMovesCtr = (WrappedComponent: any) => (props: any) => {
  return (
    <MovesContainerContext.Consumer>
      {movesCtr => <WrappedComponent {...props} movesCtr={movesCtr} />}
    </MovesContainerContext.Consumer>
  );
};

export function useMovesCtr(dispatch: Function, history: any) {
  const [movesCtr, setMovesCtr] = React.useState(() => {
    return new MovesContainer(movesContainerProps(dispatch, history));
  });
  return movesCtr;
}
