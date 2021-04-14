import React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import { useDefaultProps, FC } from 'react-default-props-context';
import { Display } from 'src/app/Display';
import { AppHeader } from 'src/app/components/AppHeader';

import './AppFrame.scss';

type PropsT = React.PropsWithChildren<{}>;

type DefaultPropsT = {
  sessionDisplay: Display;
};

export const AppFrame: FC<PropsT, DefaultPropsT> = observer((p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

  return (
    <div
      className={classnames('AppFrame flexcol', {
        'px-1': props.sessionDisplay.small,
        'px-4': !props.sessionDisplay.small,
      })}
    >
      <AppHeader />
      {props.children}
    </div>
  );
});
