import React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { debounce } from 'debounce';
import ReactResizeDetector from 'react-resize-detector';

import { useDefaultProps, FC } from 'react-default-props-context';
import { Display } from 'src/app/Display';
import { SearchMovesPage } from 'src/search/components/SearchMovesPage';
import { AccountMenu } from 'src/app/components/AccountMenu';
import { useStore } from 'src/app/components/StoreProvider';
import { CookieNotice } from 'src/app/components/CookieNotice';

import './AppFrame.scss';

// AppFrame
type PropsT = React.PropsWithChildren<{}>;

type DefaultPropsT = {
  sessionDisplay: Display;
};

export const AppFrame: FC<PropsT, DefaultPropsT> = observer((p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);
  const { profilingStore } = useStore();

  const onResize = () => {
    props.sessionDisplay.setWidth(window.innerWidth);
  };

  return (
    <div
      className={classnames('AppFrame flexcol', {
        'px-1': props.sessionDisplay.small,
        'px-4': !props.sessionDisplay.small,
      })}
    >
      <ReactResizeDetector handleWidth onResize={debounce(onResize, 10)} />
      {!profilingStore.acceptsCookies && <CookieNotice />}
      <div
        className={classnames(
          'AppFrame__Banner flexrow items-center justify-between h-16',
          {
            'mt-4 mb-4': !props.sessionDisplay.small,
            'mb-1': props.sessionDisplay.small,
          }
        )}
      >
        <div className="flexrow w-full">
          <div className="flexcol AppFrame__Home">
            <h1
              className="text-2xl font-semibold"
              onClick={() => alert('TODO')}
            >
              Lindy
            </h1>
            <h2 className="text-xl font-semibold">Science</h2>
          </div>
          <SearchMovesPage />
        </div>
        {!props.sessionDisplay.small && <AccountMenu />}
      </div>
      {props.children}
    </div>
  );
});
