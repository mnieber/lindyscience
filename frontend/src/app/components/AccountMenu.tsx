import React from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import { isUpdatedRS } from 'src/utils/RST';
import { helpUrl } from 'src/moves/utils';
import { useStore } from 'src/app/components/StoreProvider';

export const AccountMenu: React.FC = observer(() => {
  const { navigationStore, authenticationStore, profilingStore } = useStore();

  const [expanded, setExpanded] = React.useState(false);

  function toggle() {
    setExpanded(!expanded);
  }

  const greeting = isUpdatedRS(profilingStore.userProfileRS)
    ? `Hello ${
        profilingStore.userProfile
          ? profilingStore.userProfile.username
          : 'stranger!'
      } ⛛`
    : undefined;

  const node = (
    <React.Fragment>
      <button onClick={toggle}>{greeting}</button>
      {expanded && (
        <ul className="list-reset bg-white">
          <li className={classnames({ hidden: !profilingStore.userProfile })}>
            <div className="px-4 py-2 block text-black hover:bg-grey-light">
              My account
            </div>
          </li>
          <li className={classnames({ hidden: !profilingStore.userProfile })}>
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
                navigationStore.history.push(helpUrl);
              }}
            >
              Help
            </div>
          </li>
          <li className={classnames({ hidden: !profilingStore.userProfile })}>
            <div
              className="px-4 py-2 block text-black hover:bg-grey-light"
              onClick={() => {
                setExpanded(false);
                authenticationStore.signOut();
              }}
            >
              Sign out
            </div>
          </li>
          <li className={classnames({ hidden: !!profilingStore.userProfile })}>
            <div
              className="px-4 py-2 block text-black hover:bg-grey-light"
              onClick={() => {
                setExpanded(false);
                const postfix = window.location.pathname.includes('/sign-in')
                  ? ''
                  : `?next=${window.location.pathname}`;
                navigationStore.history.push('/sign-in/' + postfix);
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
