import React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import { UserProfileT } from 'src/profiles/types';
import { Navigation } from 'src/session/facets/Navigation';
import { Profiling } from 'src/session/facets/Profiling';
import { mergeDefaultProps } from 'src/npm/mergeDefaultProps';
import { helpUrl } from 'src/moves/utils';
import { createErrorHandler } from 'src/app/utils';

type PropsT = {
  defaultProps?: any;
};

type DefaultPropsT = {
  userProfile?: UserProfileT;
  navigation: Navigation;
  profiling: Profiling;
};

export const AccountMenu: React.FC<PropsT> = observer((p: PropsT) => {
  const props: PropsT & DefaultPropsT = mergeDefaultProps(p);

  const [expanded, setExpanded] = React.useState(false);

  function toggle() {
    setExpanded(!expanded);
  }

  const node = (
    <React.Fragment>
      <button onClick={toggle}>{`Hello ${
        props.userProfile ? props.userProfile.username : 'stranger!'
      } ⛛`}</button>
      {expanded && (
        <ul className="list-reset bg-white">
          <li className={classnames({ hidden: !props.userProfile })}>
            <div className="px-4 py-2 block text-black hover:bg-grey-light">
              My account
            </div>
          </li>
          <li className={classnames({ hidden: !props.userProfile })}>
            <div className="px-4 py-2 block text-black hover:bg-grey-light">
              Notifications
            </div>
          </li>
          <li>
            <hr className="border-t mx-2 border-grey-ligght" />
          </li>
          <li>
            <div
              className="px-4 py-2 block text-black hover:bg-grey-light"
              onClick={() => {
                setExpanded(false);
                props.navigation.history.push(helpUrl);
              }}
            >
              Help
            </div>
          </li>
          <li className={classnames({ hidden: !props.userProfile })}>
            <div
              className="px-4 py-2 block text-black hover:bg-grey-light"
              onClick={() => {
                setExpanded(false);
                props.profiling
                  .signOut()
                  .catch(createErrorHandler('Could not sign out'));
              }}
            >
              Sign out
            </div>
          </li>
          <li className={classnames({ hidden: !!props.userProfile })}>
            <div
              className="px-4 py-2 block text-black hover:bg-grey-light"
              onClick={() => {
                setExpanded(false);
                const postfix = window.location.pathname.includes('/sign-in')
                  ? ''
                  : `?next=${window.location.pathname}`;
                props.navigation.history.push('/sign-in/' + postfix);
              }}
            >
              Sign in
            </div>
          </li>
        </ul>
      )}
    </React.Fragment>
  );

  return (
    <div className={classnames('self-start', 'w-32')}>
      <div className={classnames('absolute', 'z-10')}>{node}</div>
    </div>
  );
});
