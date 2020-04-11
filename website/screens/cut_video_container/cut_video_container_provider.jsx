// @flow

import * as React from "react";
import { compose } from "redux";
import { observer } from "mobx-react";

import { runInAction } from "utils/mobx_wrapper";
import Ctr from "screens/containers/index";
import { Display } from "screens/session_container/facets/display";
import {
  DefaultPropsContext,
  mergeDefaultProps,
  withDefaultProps,
} from "facet/default_props";
import { getCutVideoCtrDefaultProps } from "screens/cut_video_container/cut_video_container_default_props";
import { cutVideoContainerProps } from "screens/cut_video_container/cut_video_container_props";
import {
  CutVideoContainer,
  type CutVideoContainerPropsT,
} from "screens/cut_video_container/cut_video_container";
import type { UserProfileT } from "profiles/types";
import type { MoveListT } from "move_lists/types";

type PropsT = {
  children: any,
  dispatch: Function,
  defaultProps: any,
};

type DefaultPropsT = {
  display: Display,
  moveList: MoveListT,
  userProfile: UserProfileT,
};

export const CutVideoCtrProvider = compose(
  Ctr.connect(state => ({})),
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);
  const { defaultProps } = props;

  const cutVideoCtr = useCutVideoCtr(cutVideoContainerProps(props.dispatch));
  runInAction("CutVideoContainer.setInputs", () => {
    cutVideoCtr.inputs.sessionDisplay = props.display;
    cutVideoCtr.inputs.userProfile = props.userProfile;
    cutVideoCtr.inputs.moveList = props.moveList;
  });

  return (
    <DefaultPropsContext.Provider
      value={{
        ...(defaultProps || {}),
        ...getCutVideoCtrDefaultProps(cutVideoCtr),
      }}
    >
      {props.children}
    </DefaultPropsContext.Provider>
  );
});

export function useCutVideoCtr(props: CutVideoContainerPropsT) {
  const [cutVideoCtr, setCutVideoCtr] = React.useState(() => {
    return new CutVideoContainer(props);
  });
  return cutVideoCtr;
}
