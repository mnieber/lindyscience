// @flow

import React from "react";
import { compose } from "redux";

import { useHistory } from "utils/react_router_dom_wrapper";
import { movesContainerProps } from "screens/moves_container/moves_container_props";
import { moveListsContainerProps } from "screens/movelists_container/movelists_container_props";
import type { MoveByIdT } from "moves/types";
import {
  MoveListsContainerContext,
  useMoveListsCtr,
} from "screens/movelists_container/movelists_container_context";
import {
  MovesContainerContext,
  useMovesCtr,
} from "screens/moves_container/moves_container_context";
import {
  SessionContainerContext,
  useSessionCtr,
} from "screens/session_container/session_container_context";
import type { MoveListT } from "move_lists/types";
import Ctr from "screens/containers/index";
import type { UserProfileT } from "profiles/types";

// ContainerProvider
type ContainerProviderPropsT = {
  userProfile: ?UserProfileT,
  children: any,
  dispatch: Function,
  inputMoveLists: Array<MoveListT>,
  moveById: MoveByIdT,
};

function ContainerProvider(props: ContainerProviderPropsT) {
  const history = useHistory();
  const [blackboard, setBlackboard] = React.useState({});

  const moveListsCtr = useMoveListsCtr(
    moveListsContainerProps(
      props.dispatch,
      () => blackboard && blackboard.sessionCtr.navigation.storeLocation(),
      () => blackboard && blackboard.sessionCtr.navigation.restoreLocation()
    )
  );
  const movesCtr = useMovesCtr(
    movesContainerProps(
      props.dispatch,
      () => blackboard && blackboard.sessionCtr.navigation
    )
  );

  const sessionCtr = useSessionCtr(
    props.dispatch,
    history,
    movesCtr,
    moveListsCtr
  );
  blackboard.sessionCtr = sessionCtr;

  sessionCtr.setInputs(props.userProfile, props.inputMoveLists, props.moveById);

  return (
    <SessionContainerContext.Provider value={sessionCtr}>
      <MoveListsContainerContext.Provider value={moveListsCtr}>
        <MovesContainerContext.Provider value={movesCtr}>
          {props.children}
        </MovesContainerContext.Provider>
      </MoveListsContainerContext.Provider>
    </SessionContainerContext.Provider>
  );
}

// $FlowFixMe
ContainerProvider = compose(
  Ctr.connect(state => ({
    inputMoveLists: Ctr.fromStore.getMoveLists(state),
    userProfile: Ctr.fromStore.getUserProfile(state),
    moveById: Ctr.fromStore.getMoveById(state),
  }))
)(ContainerProvider);

export default ContainerProvider;
