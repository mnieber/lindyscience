// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import { MoveListsContainer } from "screens/movelists_container/movelists_container";
import { getMovesCtrDefaultProps } from "screens/moves_container/moves_container_default_props";
import {
  DefaultPropsContext,
  mergeDefaultProps,
  withDefaultProps,
} from "screens/default_props";
import { lookUp } from "utils/utils";
import Ctr from "screens/containers/index";
import { SessionContainer } from "screens/session_container/session_container";
import { Navigation } from "screens/session_container/facets/navigation";
import { movesContainerProps } from "screens/moves_container/moves_container_props";
import {
  MovesContainer,
  type MovesContainerPropsT,
} from "screens/moves_container/moves_container";
import type { MoveByIdT } from "moves/types";
import type { MoveListT } from "move_lists/types";
import type { UserProfileT } from "profiles/types";

type PropsT = {
  moveById: MoveByIdT,
  children: any,
  defaultProps: any,
  dispatch: Function,
};

type DefaultPropsT = {
  navigation: Navigation,
  moveList: MoveListT,
  userProfile: UserProfileT,
  moveListsPreview: Array<MoveListT>,
  sessionCtr: SessionContainer,
  moveListsCtr: MoveListsContainer,
};

export const MovesCtrProvider = compose(
  Ctr.connect(state => ({
    moveById: Ctr.fromStore.getMoveById(state),
  })),
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);
  const { defaultProps, ...passThroughProps } = props;

  const movesCtr = useMovesCtr(
    movesContainerProps(props.dispatch, props.navigation)
  );

  const inputMoves = props.moveList
    ? lookUp(props.moveList ? props.moveList.moves : [], props.moveById).filter(
        x => !!x
      )
    : [];

  movesCtr.setInputs(
    inputMoves,
    props.moveList,
    props.moveListsPreview,
    props.userProfile
  );

  return (
    <DefaultPropsContext.Provider
      value={{
        ...(defaultProps || {}),
        ...getMovesCtrDefaultProps(movesCtr),
      }}
    >
      {props.children}
    </DefaultPropsContext.Provider>
  );
});

export function useMovesCtr(props: MovesContainerPropsT) {
  const [movesCtr, setMovesCtr] = React.useState(() => {
    return new MovesContainer(props);
  });
  return movesCtr;
}
