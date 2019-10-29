// @flow

import * as React from "react";

import {
  MoveListsContainer,
  type MoveListsContainerPropsT,
} from "screens/movelists_container/movelists_container";
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

export function useMoveListsCtr(props: MoveListsContainerPropsT) {
  const [moveListsCtr, setMoveListsCtr] = React.useState(() => {
    return new MoveListsContainer(props);
  });
  return moveListsCtr;
}
