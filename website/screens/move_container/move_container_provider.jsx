// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import { runInAction } from "utils/mobx_wrapper";
import {
  DefaultPropsContext,
  mergeDefaultProps,
  withDefaultProps,
} from "facet/default_props";
import { getMoveCtrDefaultProps } from "screens/move_container/move_container_default_props";
import { Display } from "screens/session_container/facets/display";
import { moveContainerProps } from "screens/move_container/move_container_props";
import {
  MoveContainer,
  type MoveContainerPropsT,
} from "screens/move_container/move_container";
import type { MoveT } from "moves/types";

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
  const { defaultProps } = props;

  const moveCtr = useMoveCtr(moveContainerProps());
  runInAction("moveContainer.setInputs", () => {
    moveCtr.inputs.move = props.move;
    moveCtr.inputs.sessionDisplay = props.display;
  });

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
