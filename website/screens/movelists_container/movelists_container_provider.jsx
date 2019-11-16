// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import {
  DefaultPropsContext,
  mergeDefaultProps,
  withDefaultProps,
} from "screens/default_props";
import { Navigation } from "screens/session_container/facets/navigation";
import Ctr from "screens/containers/index";
import { Display } from "screens/session_container/facets/display";
import { getMoveListsCtrDefaultProps } from "screens/movelists_container/movelists_container_default_props";
import {
  MoveListsContainer,
  type MoveListsContainerPropsT,
} from "screens/movelists_container/movelists_container";
import { moveListsContainerProps } from "screens/movelists_container/movelists_container_props";
import type { MoveListT } from "move_lists/types";
import type { UserProfileT } from "profiles/types";

type PropsT = {
  inputMoveLists: Array<MoveListT>,
  children: any,
  dispatch: Function,
  defaultProps: any,
};

type DefaultPropsT = {
  display: Display,
  userProfile: UserProfileT,
  navigation: Navigation,
};

export const MoveListsCtrProvider = compose(
  Ctr.connect(state => ({
    inputMoveLists: Ctr.fromStore.getMoveLists(state),
  })),
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);
  const { defaultProps, ...passThroughProps } = props;

  const moveListsCtr = useMoveListsCtr(
    moveListsContainerProps(props.dispatch, props.navigation)
  );
  moveListsCtr.setInputs(props.inputMoveLists, props.userProfile);

  return (
    <DefaultPropsContext.Provider
      value={{
        ...(defaultProps || {}),
        ...getMoveListsCtrDefaultProps(moveListsCtr),
      }}
    >
      {props.children}
    </DefaultPropsContext.Provider>
  );
});

export function useMoveListsCtr(props: MoveListsContainerPropsT) {
  const [moveListsCtr, setMoveListsCtr] = React.useState(() => {
    return new MoveListsContainer(props);
  });
  return moveListsCtr;
}
