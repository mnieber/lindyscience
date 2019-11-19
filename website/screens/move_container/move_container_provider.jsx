// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import {
  DefaultPropsContext,
  mergeDefaultProps,
  withDefaultProps,
} from "screens/default_props";
import { getMoveCtrDefaultProps } from "screens/move_container/move_container_default_props";
import { Display } from "screens/session_container/facets/display";
import type { MoveT } from "moves/types";
import { moveContainerProps } from "screens/move_container/move_container_props";
import {
  MoveContainer,
  type MoveContainerPropsT,
} from "screens/move_container/move_container";

type PropsT = {
  children: any,
  defaultProps: any,
};

type DefaultPropsT = {
  display: Display,
  move: MoveT,
};

export const MoveCtrProvider = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);
  const { defaultProps, ...passThroughProps } = props;

  const moveCtr = useMoveCtr(moveContainerProps());
  moveCtr.setInputs(props.display, props.move);

  return (
    <DefaultPropsContext.Provider
      value={{
        ...(defaultProps || {}),
        ...getMoveCtrDefaultProps(moveCtr),
      }}
    >
      {props.children}
    </DefaultPropsContext.Provider>
  );
});

export function useMoveCtr(props: MoveContainerPropsT) {
  const [moveCtr, setMoveCtr] = React.useState(() => {
    return new MoveContainer(props);
  });
  return moveCtr;
}
