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
import { useHistory } from "utils/react_router_dom_wrapper";
import { getSessionCtrDefaultProps } from "screens/session_container/session_container_default_props";
import { SessionContainer } from "screens/session_container/session_container";
import { sessionContainerProps } from "screens/session_container/session_container_props";
import Ctr from "screens/containers/index";
import type { UserProfileT } from "profiles/types";
import type { MoveT } from "moves/types";

// $FlowFixMe
export const SessionContainerContext = React.createContext({});

type PropsT = {
  children: any,
  userProfile: ?UserProfileT,
  dispatch: Function,
  defaultProps: any,
};

type DefaultPropsT = {
  move: MoveT,
};

export const SessionCtrProvider = compose(
  Ctr.connect(state => ({
    userProfile: Ctr.fromStore.getUserProfile(state),
  })),
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props = mergeDefaultProps<PropsT & DefaultPropsT>(p);
  const { defaultProps, ...passThroughProps } = props;
  const history = useHistory();

  const sessionCtr = useSessionCtr(props.dispatch, history);
  runInAction("sessionContainer.setInputs", () => {
    sessionCtr.inputs.userProfile = props.userProfile;
  });

  return (
    <DefaultPropsContext.Provider
      value={{
        ...(defaultProps || {}),
        ...getSessionCtrDefaultProps(sessionCtr),
      }}
    >
      {props.children}
    </DefaultPropsContext.Provider>
  );
});

export function useSessionCtr(dispatch: Function, history: any) {
  const [sessionCtr, setSessionCtr] = React.useState(() => {
    const result = new SessionContainer(
      sessionContainerProps(dispatch, history)
    );
    result.profiling.loadEmail();
    return result;
  });
  return sessionCtr;
}
