import { compose } from 'lodash/fp';
import React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { debounce } from 'debounce';
import ReactResizeDetector from 'react-resize-detector';

import { useDefaultProps, FC } from 'react-default-props-context';
import { Display } from 'src/session/facets/Display';
import { Profiling } from 'src/session/facets/Profiling';
import { SearchMovesPage } from 'src/search/containers/SearchMovesPage';
import { AccountMenu } from 'src/app/presentation/AccountMenu';

// AppFrame
type PropsT = {
  children: any;
};

type DefaultPropsT = {
  profiling: Profiling;
  display: Display;
};

export const AppFrame: FC<PropsT, DefaultPropsT> = compose(observer)(
  (p: PropsT) => {
    const props = useDefaultProps<PropsT, DefaultPropsT>(p);

    const cookieNotice = props.profiling.acceptsCookies ? undefined : (
      <div className="cookieNotice flexrow justify-around items-center">
        <div>
          This site uses cookies to store the settings for the logged in user.
          By continuing to use this site you agree with that.
          <button
            className="button button--wide ml-2"
            onClick={props.profiling.acceptCookies}
          >
            Okay
          </button>
        </div>
      </div>
    );

    const onResize = () => {
      props.display.setWidth(window.innerWidth);
    };

    return (
      <div
        className={classnames('appFrame flexcol', {
          'px-1': props.display.small,
          'px-4': !props.display.small,
        })}
      >
        <ReactResizeDetector handleWidth onResize={debounce(onResize, 10)} />
        {cookieNotice}
        <div
          className={classnames(
            'appFrame__banner flexrow items-center justify-between h-16',
            { 'mt-4 mb-4': !props.display.small, 'mb-1': props.display.small }
          )}
        >
          <div className="flexrow w-full">
            <div className="flexcol appFrame__home">
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
          {!props.display.small && (
            <AccountMenu defaultProps={props.defaultProps} />
          )}
        </div>
        {props.children}
      </div>
    );
  }
);
