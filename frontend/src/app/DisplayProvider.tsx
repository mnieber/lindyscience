import * as React from 'react';

import { Display } from 'src/app/Display';
import { reaction } from 'mobx';
import { CtrProvider } from 'react-default-props-context';

type PropsT = React.PropsWithChildren<{}>;

export const DisplayContext = React.createContext({});

// Note: don't observe this with MobX
export const DisplayProvider: React.FC<PropsT> = (props: PropsT) => {
  const createCtr = () => {
    const ctr = new Display();
    return ctr;
  };

  const updateCtr = (ctr: Display) =>
    reaction(
      () => [],
      () => {},
      {
        fireImmediately: true,
      }
    );

  const getDefaultProps = (ctr: Display) => {
    return {
      sessionDisplay: () => ctr,
    };
  };

  return (
    <CtrProvider
      createCtr={createCtr}
      destroyCtr={(ctr) => ctr.destroy()}
      updateCtr={updateCtr}
      getDefaultProps={getDefaultProps}
      children={props.children}
    />
  );
};
