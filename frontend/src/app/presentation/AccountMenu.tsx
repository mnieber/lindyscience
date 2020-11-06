import React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import { isUpdatedRS } from 'src/utils/RST';
import { UserProfileT } from 'src/profiles/types';
import { Navigation } from 'src/session/facets/Navigation';
import { Profiling } from 'src/session/facets/Profiling';
import { Authentication } from 'src/session/facets/Authentication';
import { useDefaultProps, FC } from 'react-default-props-context';
import { helpUrl } from 'src/moves/utils';

type PropsT = {};

type DefaultPropsT = {
  userProfile?: UserProfileT;
  navigation: Navigation;
  authentication: Authentication;
  profiling: Profiling;
};

export const AccountMenu: FC<PropsT, DefaultPropsT> = observer((p: PropsT) => {
  const props = useDefaultProps<PropsT, DefaultPropsT>(p);

  const [expanded, setExpanded] = React.useState(false);

  function toggle() {
    setExpanded(!expanded);
  }

  const greeting = isUpdatedRS(props.profiling.userProfileRS)
    ? `Hello ${props.userProfile ? props.userProfile.username : 'stranger!'} ⛛`
    : undefined;

  const node = (
    <React.Fragment>
      <button onClick={toggle}>{greeting}</button>
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
                props.authentication.signOut();
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
