import * as React from 'react';
import { createBrowserHistory } from 'history';

import { SessionContainer } from 'src/session/SessionCtr';
import { reaction } from 'src/utils/mobx_wrapper';
import { useDefaultProps, FC, CtrProvider } from 'react-default-props-context';

export const SessionContainerContext = React.createContext({});

type PropsT = React.PropsWithChildren<{}>;

type DefaultPropsT = {};

// Note: don't observe this with MobX
export const SessionCtrProvider: FC<PropsT, DefaultPropsT> = (p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

  const createCtr = () => {
    const history = createBrowserHistory({
      basename: process.env.PUBLIC_URL,
    });

    const ctr = new SessionContainer({ history });
    ctr.authentication.loadUserId();
    ctr.tagsStore.loadKnownTags();
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
      sessionDisplay: () => ctr.display,
      profiling: () => ctr.profiling,
      userProfile: () => ctr.profiling.userProfile,
      isOwner: () => ctr.profiling.isOwner,
      movesStore: () => ctr.movesStore,
      moveListsStore: () => ctr.moveListsStore,
      tipsStore: () => ctr.tipsStore,
      votesStore: () => ctr.votesStore,
      tagsStore: () => ctr.tagsStore,
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
};
