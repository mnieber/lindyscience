import { compose } from 'lodash/fp';
import * as React from 'react';
import { observer } from 'mobx-react';
import { createBrowserHistory } from 'history';

import { SessionContainer } from 'src/session/SessionCtr';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/npm/facet-mobx';
import {
  mergeDefaultProps,
  withDefaultProps,
} from 'react-default-props-context';

export const SessionContainerContext = React.createContext({});

type PropsT = {
  children: any;
  defaultProps?: any;
};

type DefaultPropsT = {};

export const SessionCtrProvider: React.FC<PropsT> = compose(
  withDefaultProps,
  observer
)((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  const createCtr = () => {
    const history = createBrowserHistory({
      basename: process.env.PUBLIC_URL,
    });

    const ctr = new SessionContainer({ history });
    ctr.profiling.loadEmail();
    return ctr;
  };

  const updateCtr = (ctr: SessionContainer) => {
    reaction(
      () => [],
      () => {}
    );
  };

  const getDefaultProps = (ctr: SessionContainer) => {
    return {
      sessionCtr: () => ctr,
      authentication: () => ctr.authentication,
      navigation: () => ctr.navigation,
      display: () => ctr.display,
      profiling: () => ctr.profiling,
      userProfile: () => ctr.profiling.userProfile,
      isOwner: () => ctr.profiling.isOwner,
      movesStore: () => ctr.data.movesStore,
      moveListsStore: () => ctr.data.moveListsStore,
      tipsStore: () => ctr.data.tipsStore,
      votesStore: () => ctr.data.votesStore,
    };
  };

  return (
    <CtrProvider
      createCtr={createCtr}
      updateCtr={updateCtr}
      getDefaultProps={getDefaultProps}
      children={props.children}
    />
  );
});
