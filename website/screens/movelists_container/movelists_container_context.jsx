// @flow

import * as React from "react";

import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { moveListsContainerProps } from "screens/movelists_container/movelists_container_props";

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

export function useMoveListsCtr(dispatch: Function, history: any) {
  const [moveListsCtr, setMoveListsCtr] = React.useState(() => {
    return new MoveListsContainer(moveListsContainerProps(dispatch, history));
  });
  return moveListsCtr;
}
