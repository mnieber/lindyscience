import * as React from 'react';
import { observer } from 'mobx-react';
import { createBrowserHistory } from 'history';

import { SessionContainer } from 'src/session/SessionCtr';
import { reaction } from 'src/utils/mobx_wrapper';
import { CtrProvider } from 'src/app/CtrProvider';
import { useDefaultProps, FC } from 'react-default-props-context';

export const SessionContainerContext = React.createContext({});

type PropsT = React.PropsWithChildren<{}>;

type DefaultPropsT = {};

export const SessionCtrProvider: FC<PropsT, DefaultPropsT> = observer(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    const createCtr = () => {
      const history = createBrowserHistory({
        basename: process.env.PUBLIC_URL,
      });

      const ctr = new SessionContainer({ history });
      ctr.authentication.loadUserId();
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
  }
);
